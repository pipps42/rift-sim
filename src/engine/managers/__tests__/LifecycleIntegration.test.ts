/**
 * Integration tests for CardScriptRuntime lifecycle hooks in managers
 * Tests TurnManager (onTurnStart, onTurnEnd, onPhaseChange) and GameManager (processDeaths)
 */

import { GameManager } from '../GameManager';
import { TurnManager } from '../TurnManager';
import { CardScriptRuntime } from '../../scripting/CardScriptRuntime';
import type { Game, Player, GameCard, CardType, Domain, Rarity } from '@/types/game';
import { GamePhase, GameStatus } from '@/types/game';
import type { CardScript } from '../../scripting/types/CardScriptTypes';

// Mock CardScriptRuntime
jest.mock('../../scripting/CardScriptRuntime');

describe('Lifecycle Integration Tests', () => {
  let gameManager: GameManager;
  let turnManager: TurnManager;
  let mockRuntime: jest.Mocked<CardScriptRuntime>;
  let game: Game;

  beforeEach(async () => {
    // Create mock runtime
    mockRuntime = new CardScriptRuntime() as jest.Mocked<CardScriptRuntime>;

    // Create mock loader with properly mocked loadScript
    const mockLoadScript = jest.fn();
    const mockLoader = {
      loadScript: mockLoadScript,
    };
    mockRuntime.getLoader = jest.fn().mockReturnValue(mockLoader);
    mockRuntime.executeHook = jest.fn();
    mockRuntime.initialize = jest.fn();

    // Create managers
    gameManager = new GameManager();
    await gameManager.initialize();

    // Inject mock runtime into gameManager
    (gameManager as any).cardScriptRuntime = mockRuntime;

    turnManager = new TurnManager(mockRuntime);

    // Create a test game
    game = createTestGame();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('TurnManager - onTurnStart hooks', () => {
    it('should execute onTurnStart hooks for current player cards at turn start', async () => {
      const player = game.players[0];
      const cardInHand = createMockCard('test-card-1', player.id);
      player.zones.hand.push(cardInHand);

      const mockScript: CardScript = {
        onTurnStart: jest.fn(),
      };

      // Mock script loading
      (mockRuntime.getLoader().loadScript as jest.Mock).mockResolvedValue(mockScript);

      await turnManager.startTurn(game);

      // Verify executeHook was called for onTurnStart
      // Signature: executeHook(hookName, card, game, additionalContext?)
      expect(mockRuntime.executeHook).toHaveBeenCalledWith(
        'onTurnStart',
        expect.objectContaining({ cardId: 'test-card-1' }), // card
        game,
        expect.anything() // context is built internally
      );
    });

    it('should not execute hooks for opponent cards at turn start', async () => {
      const currentPlayer = game.players[0];
      const opponent = game.players[1];

      const opponentCard = createMockCard('opponent-card', opponent.id);
      opponent.zones.hand.push(opponentCard);

      const mockScript: CardScript = {
        onTurnStart: jest.fn(),
      };

      (mockRuntime.getLoader().loadScript as jest.Mock).mockResolvedValue(mockScript);

      await turnManager.startTurn(game);

      // Verify hook was only called once (for current player)
      // Not called for opponent's cards
      const hookCalls = (mockRuntime.executeHook as jest.Mock).mock.calls;
      expect(hookCalls.every(call => call[2] === game)).toBe(true);
    });

    it('should handle missing scripts gracefully', async () => {
      const player = game.players[0];
      const cardInHand = createMockCard('test-card', player.id);
      player.zones.hand.push(cardInHand);

      // Mock script not found
      (mockRuntime.getLoader().loadScript as jest.Mock).mockRejectedValue(new Error('Script not found'));

      // Should not throw
      await expect(turnManager.startTurn(game)).resolves.not.toThrow();
    });
  });

  describe('TurnManager - onTurnEnd hooks', () => {
    it('should execute onTurnEnd hooks for current player cards at turn end', async () => {
      const player = game.players[0];
      const cardInBase = createMockCard('base-card', player.id);
      player.zones.base.push(cardInBase);

      const mockScript: CardScript = {
        onTurnEnd: jest.fn(),
      };

      (mockRuntime.getLoader().loadScript as jest.Mock).mockResolvedValue(mockScript);

      await turnManager.endTurn(game);

      // Verify executeHook was called for onTurnEnd
      // Signature: executeHook(hookName, card, game, additionalContext?)
      expect(mockRuntime.executeHook).toHaveBeenCalledWith(
        'onTurnEnd',
        expect.objectContaining({ cardId: 'base-card' }), // card
        game,
        expect.anything() // context is built internally
      );
    });
  });

  describe('TurnManager - onPhaseChange hooks', () => {
    it('should execute onPhaseChange hooks for all cards when phase changes', async () => {
      const player1 = game.players[0];
      const player2 = game.players[1];

      const card1 = createMockCard('card-1', player1.id);
      const card2 = createMockCard('card-2', player2.id);
      player1.zones.hand.push(card1);
      player2.zones.hand.push(card2);

      const mockScript = {
        onPhaseChange: jest.fn(),
      } as any;

      (mockRuntime.getLoader().loadScript as jest.Mock).mockResolvedValue(mockScript);

      game.phase = GamePhase.AWAKEN;
      await turnManager.nextPhase(game);

      // Should be called for both players' cards
      expect(mockRuntime.executeHook).toHaveBeenCalledTimes(2);

      // Verify signature: executeHook(hookName, card, game, additionalContext?)
      const calls = (mockRuntime.executeHook as jest.Mock).mock.calls;
      // All calls should have hookName as first arg, card as second, game as third
      calls.forEach(call => {
        expect(call[0]).toBe('onPhaseChange'); // hookName
        expect(call[1]).toHaveProperty('cardId'); // card
        expect(call[2]).toBe(game); // game
      });
    });
  });

  describe('GameManager - processDeaths', () => {
    it('should execute onDeath hooks before moving units to trash', async () => {
      const player = game.players[0];
      const deadUnit = createMockCard('dead-unit', player.id);
      deadUnit.cardType = 'unit' as CardType;
      deadUnit.damage = 5;
      deadUnit.might = 3; // Dead (damage >= might)

      // Add unit to battlefield
      const battlefield = {
        id: 'bf-1',
        name: 'Test Battlefield',
        units: [deadUnit],
        sides: { [player.id]: [deadUnit] },
        contested: false,
      };
      game.battlefields.push(battlefield as any);

      const mockScript: CardScript = {
        onDeath: jest.fn(),
      };

      (mockRuntime.getLoader().loadScript as jest.Mock).mockResolvedValue(mockScript);

      await gameManager.processDeaths(game);

      // Verify onDeath was called
      // Signature: executeHook(hookName, card, game, additionalContext?)
      expect(mockRuntime.executeHook).toHaveBeenCalledWith(
        'onDeath',
        expect.objectContaining({ cardId: 'dead-unit' }), // card
        game,
        expect.anything() // context is built internally
      );

      // Verify unit was moved to trash
      expect(player.zones.trash).toContainEqual(expect.objectContaining({
        cardId: 'dead-unit',
      }));

      // Verify unit was removed from battlefield
      expect(battlefield.units).not.toContain(deadUnit);
    });

    it('should not process units that are not dead', async () => {
      const player = game.players[0];
      const aliveUnit = createMockCard('alive-unit', player.id);
      aliveUnit.cardType = 'unit' as CardType;
      aliveUnit.damage = 2;
      aliveUnit.might = 5; // Alive (damage < might)

      const battlefield = {
        id: 'bf-1',
        name: 'Test Battlefield',
        units: [aliveUnit],
        contested: false,
      };
      game.battlefields.push(battlefield as any);

      await gameManager.processDeaths(game);

      // onDeath should not be called
      expect(mockRuntime.executeHook).not.toHaveBeenCalled();

      // Unit should still be on battlefield
      expect(battlefield.units).toContain(aliveUnit);
      expect(player.zones.trash).not.toContain(aliveUnit);
    });

    it('should process multiple deaths in one batch', async () => {
      const player = game.players[0];
      const deadUnit1 = createMockCard('dead-1', player.id);
      const deadUnit2 = createMockCard('dead-2', player.id);

      deadUnit1.cardType = 'unit' as CardType;
      deadUnit1.damage = 5;
      deadUnit1.might = 3;

      deadUnit2.cardType = 'unit' as CardType;
      deadUnit2.damage = 4;
      deadUnit2.might = 2;

      const battlefield = {
        id: 'bf-1',
        name: 'Test Battlefield',
        units: [deadUnit1, deadUnit2],
        contested: false,
      };
      game.battlefields.push(battlefield as any);

      const mockScript: CardScript = {
        onDeath: jest.fn(),
      };

      (mockRuntime.getLoader().loadScript as jest.Mock).mockResolvedValue(mockScript);

      await gameManager.processDeaths(game);

      // onDeath should be called twice
      expect(mockRuntime.executeHook).toHaveBeenCalledTimes(2);

      // Both units should be in trash
      expect(player.zones.trash).toHaveLength(2);
      expect(battlefield.units).toHaveLength(0);
    });

    it('should handle onDeath hook errors gracefully', async () => {
      const player = game.players[0];
      const deadUnit = createMockCard('dead-unit', player.id);
      deadUnit.cardType = 'unit' as CardType;
      deadUnit.damage = 5;
      deadUnit.might = 3;

      const battlefield = {
        id: 'bf-1',
        name: 'Test Battlefield',
        units: [deadUnit],
        contested: false,
      };
      game.battlefields.push(battlefield as any);

      // Mock script execution error
      (mockRuntime.getLoader().loadScript as jest.Mock).mockRejectedValue(new Error('Script error'));

      // Should not throw, but still move unit to trash
      await expect(gameManager.processDeaths(game)).resolves.not.toThrow();

      // Unit should still be moved to trash despite error
      expect(player.zones.trash).toContainEqual(expect.objectContaining({
        cardId: 'dead-unit',
      }));
    });
  });
});

// ============================================================================
// TEST HELPERS
// ============================================================================

function createTestGame(): Game {
  const player1: Player = {
    id: 'player-1',
    name: 'Player 1',
    score: 0,
    championLegend: {} as any,
    zones: {
      hand: [],
      mainDeck: [],
      trash: [],
      runeDeck: [],
      runes: [],
      base: [],
      championZone: [],
      banishment: [],
    },
    runePool: {
      energy: 0,
      power: [],
    },
    hasPlayedCard: false,
    turnsPassed: 0,
  };

  const player2: Player = {
    id: 'player-2',
    name: 'Player 2',
    score: 0,
    championLegend: {} as any,
    zones: {
      hand: [],
      mainDeck: [],
      trash: [],
      runeDeck: [],
      runes: [],
      base: [],
      championZone: [],
      banishment: [],
    },
    runePool: {
      energy: 0,
      power: [],
    },
    hasPlayedCard: false,
    turnsPassed: 0,
  };

  return {
    id: 'test-game',
    players: [player1, player2],
    currentPlayerIndex: 0,
    phase: GamePhase.AWAKEN,
    turnState: 'neutral_open' as any,
    round: 1,
    currentTurn: 1,
    status: GameStatus.IN_PROGRESS,
    battlefields: [],
    chain: [],
    storage: {} as any,
    history: [],
    historyQuery: {} as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Game;
}

function createMockCard(cardId: string, ownerId: string): GameCard {
  return {
    id: cardId,
    instanceId: `instance-${cardId}`,
    cardId,
    name: `Card ${cardId}`,
    ownerId,
    controllerId: ownerId,
    zone: 'hand',
    ready: true,
    damage: 0,
    might: 5,
    cardType: 'unit' as CardType,
    energyCost: 1,
    powerCost: [],
    description: 'Test card',
    domains: ['fury'] as Domain[],
    keywords: [],
    tags: [],
    rarity: 'common' as Rarity,
    temporaryModifiers: [],
    counters: [],
  } as GameCard;
}
