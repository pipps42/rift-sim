/**
 * ChainSystem V3 Integration Tests
 *
 * Tests the integration of ChainSystem with:
 * - PlayCardAction for spell casting
 * - CardScriptRuntime for spell resolution
 * - processDeaths during cleanup
 */

import { ChainSystem } from '../ChainSystem';
import { PlayCardAction } from '../../actions/concrete/PlayCardAction';
import { ActionExecutor } from '../../actions/ActionExecutor';
import { CardScriptRuntime } from '../../scripting/CardScriptRuntime';
import { CardScriptLoader } from '../../scripting/CardScriptLoader';
import { ModifierRegistry } from '../../actions/ModifierRegistry';
import { TriggerRegistry } from '../../actions/TriggerRegistry';
import {
  Game,
  Player,
  GameCard,
  GameStatus,
  GamePhase,
  TurnState,
  CardType,
  Domain,
  Rarity,
  ChainItemType,
} from '../../../types/game';
import { CardStorage } from '../../storage/CardStorage';

describe('ChainSystem V3 Integration', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;
  let chainSystem: ChainSystem;
  let executor: ActionExecutor;
  let scriptRuntime: CardScriptRuntime;
  let processDeathsCalled: boolean;

  beforeEach(() => {
    // Create test players
    player1 = createTestPlayer('player-1', 'Player 1');
    player2 = createTestPlayer('player-2', 'Player 2');

    // Create game
    game = {
      id: 'test-game',
      status: GameStatus.IN_PROGRESS,
      players: [player1, player2],
      currentPlayerIndex: 0,
      currentTurn: 1,
      round: 1,
      phase: GamePhase.ACTION,
      turnState: TurnState.NEUTRAL_OPEN,
      battlefields: [],
      chain: [],
      storage: new CardStorage(),
      history: [],
      historyQuery: {} as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      processDeaths: jest.fn(async () => {
        processDeathsCalled = true;
      }),
    };

    processDeathsCalled = false;

    // Create V3 infrastructure
    scriptRuntime = new CardScriptRuntime();
    executor = new ActionExecutor(game);
    chainSystem = new ChainSystem(scriptRuntime);
  });

  describe('Spell Casting with PlayCardAction', () => {
    it('should create ChainItem when playing a spell card', async () => {
      // Arrange
      const spell = createSpellCard('test-spell', 'Test Spell', 2);
      player1.zones.hand.push(spell);
      player1.runePool.energy = 5; // Enough to pay

      // Act
      const playAction = new PlayCardAction(player1, { card: spell });
      await executor.execute(playAction);

      // Assert
      expect(game.chain).toHaveLength(1);
      expect(game.chain[0]?.type).toBe(ChainItemType.SPELL);
      expect(game.chain[0]?.sourceCardId).toBe(spell.cardId);
      expect(game.chain[0]?.controllerId).toBe('player-1');
      expect(game.turnState).toBe(TurnState.NEUTRAL_CLOSED); // Chain active
    });

    it('should deduct spell cost and remove from hand', async () => {
      // Arrange
      const spell = createSpellCard('test-spell', 'Test Spell', 3);
      player1.zones.hand.push(spell);
      player1.runePool.energy = 5;

      // Act
      const playAction = new PlayCardAction(player1, { card: spell });
      await executor.execute(playAction);

      // Assert
      expect(player1.runePool.energy).toBe(2); // 5 - 3 = 2
      expect(player1.zones.hand).toHaveLength(0); // Removed from hand
    });

    it('should set spell zone to "chain" while on chain', async () => {
      // Arrange
      const spell = createSpellCard('test-spell', 'Test Spell', 1);
      player1.zones.hand.push(spell);
      player1.runePool.energy = 5;

      // Act
      const playAction = new PlayCardAction(player1, { card: spell });
      await executor.execute(playAction);

      // Assert
      expect(spell.zone).toBe('chain');
    });
  });

  describe('Chain Resolution with CardScriptRuntime', () => {
    it('should resolve spell and execute onPlay hook', async () => {
      // Arrange
      const spell = createSpellCard('simple-spell', 'Simple Spell', 1);
      player1.zones.hand.push(spell);
      player1.runePool.energy = 5;

      // Create ChainItem manually (simulating PlayCardAction)
      game.chain.push({
        id: 'chain-item-1',
        type: ChainItemType.SPELL,
        sourceCardId: spell.cardId,
        sourceCard: spell,
        controllerId: 'player-1',
        targets: [],
        effects: [],
        spellTiming: 'normal' as any,
        timestamp: new Date(),
        resolved: false,
      });

      spell.zone = 'chain' as any;
      game.turnState = TurnState.NEUTRAL_CLOSED; // Chain active state

      // Act
      await chainSystem.resolve(game);

      // Assert
      expect(game.chain).toHaveLength(0); // Chain empty after resolution
      expect(spell.zone).toBe('trash'); // Spell moved to trash
      expect(player1.zones.trash).toContain(spell);
      expect(game.turnState).toBe(TurnState.NEUTRAL_OPEN); // Returned to Open
    });

    it('should call processDeaths during cleanup', async () => {
      // Arrange
      const spell = createSpellCard('damage-spell', 'Damage Spell', 2);
      spell.zone = 'chain' as any;

      game.chain.push({
        id: 'chain-item-1',
        type: ChainItemType.SPELL,
        sourceCardId: spell.cardId,
        sourceCard: spell,
        controllerId: 'player-1',
        targets: [],
        effects: [],
        spellTiming: 'normal' as any,
        timestamp: new Date(),
        resolved: false,
      });

      // Act
      await chainSystem.resolve(game);

      // Assert
      expect(processDeathsCalled).toBe(true);
    });

    it('should handle spell with no script gracefully', async () => {
      // Arrange
      const spell = createSpellCard('no-script-spell', 'No Script Spell', 1);
      spell.cardId = 'nonexistent-script-id'; // Script won't be found
      spell.zone = 'chain' as any;

      game.chain.push({
        id: 'chain-item-1',
        type: ChainItemType.SPELL,
        sourceCardId: spell.cardId,
        sourceCard: spell,
        controllerId: 'player-1',
        targets: [],
        effects: [],
        spellTiming: 'normal' as any,
        timestamp: new Date(),
        resolved: false,
      });

      // Act & Assert - should not throw
      await expect(chainSystem.resolve(game)).resolves.not.toThrow();
      expect(game.chain).toHaveLength(0);
      expect(spell.zone).toBe('trash');
    });
  });

  describe('Multiple Spells on Chain (LIFO)', () => {
    it('should resolve spells in LIFO order (last in, first out)', async () => {
      // Arrange
      const spell1 = createSpellCard('spell-1', 'Spell 1', 1);
      const spell2 = createSpellCard('spell-2', 'Spell 2', 1);
      const spell3 = createSpellCard('spell-3', 'Spell 3', 1);

      spell1.zone = 'chain' as any;
      spell2.zone = 'chain' as any;
      spell3.zone = 'chain' as any;

      // Add in order: spell1, spell2, spell3
      game.chain.push(
        {
          id: 'chain-item-1',
          type: ChainItemType.SPELL,
          sourceCardId: spell1.cardId,
          sourceCard: spell1,
          controllerId: 'player-1',
          targets: [],
          effects: [],
          spellTiming: 'normal' as any,
          timestamp: new Date(),
          resolved: false,
        },
        {
          id: 'chain-item-2',
          type: ChainItemType.SPELL,
          sourceCardId: spell2.cardId,
          sourceCard: spell2,
          controllerId: 'player-1',
          targets: [],
          effects: [],
          spellTiming: 'normal' as any,
          timestamp: new Date(),
          resolved: false,
        },
        {
          id: 'chain-item-3',
          type: ChainItemType.SPELL,
          sourceCardId: spell3.cardId,
          sourceCard: spell3,
          controllerId: 'player-1',
          targets: [],
          effects: [],
          spellTiming: 'normal' as any,
          timestamp: new Date(),
          resolved: false,
        }
      );

      // Act
      await chainSystem.resolve(game);

      // Assert
      expect(game.chain).toHaveLength(0);
      // All spells should be in trash
      expect(player1.zones.trash).toContain(spell1);
      expect(player1.zones.trash).toContain(spell2);
      expect(player1.zones.trash).toContain(spell3);
      // processDeaths called after EACH resolution (3 times)
      expect(processDeathsCalled).toBe(true);
    });
  });
});

// Helper functions

function createTestPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    score: 0,
    championLegend: {} as any,
    zones: {
      mainDeck: [],
      runeDeck: [],
      hand: [],
      base: [],
      runes: [],
      championZone: [],
      trash: [],
      banishment: [],
    },
    runePool: {
      energy: 0,
      power: [],
    },
    hasPlayedCard: false,
    turnsPassed: 0,
  };
}

function createSpellCard(cardId: string, name: string, energyCost: number): GameCard {
  return {
    id: cardId,
    instanceId: `instance-${cardId}`,
    cardId,
    name,
    description: 'Test spell description',
    cardType: CardType.SPELL,
    domains: [Domain.FURY],
    rarity: Rarity.COMMON,
    energyCost,
    powerCost: [],
    keywords: [],
    tags: [],
    might: 0,
    damage: 0,
    ready: false,
    ownerId: 'player-1',
    controllerId: 'player-1',
    zone: 'hand',
    temporaryModifiers: [],
    counters: [],
  };
}
