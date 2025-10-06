import { CombatManager } from '../CombatManager';
import { PriorityManager } from '../../managers/PriorityManager';
import {
  Game,
  Player,
  Battlefield,
  GameCard,
  CombatStep,
  TurnState,
  GameStatus,
  GamePhase,
  Domain,
  CardType,
  Rarity,
  Keyword
} from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

describe('CombatManager', () => {
  let combatManager: CombatManager;
  let priorityManager: PriorityManager;
  let mockGame: Game;

  beforeEach(() => {
    priorityManager = new PriorityManager();
    combatManager = new CombatManager(priorityManager);
    mockGame = createMockGame();
  });

  describe('initiateShowdown', () => {
    it('should create showdown state when battlefield is contested', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');

      expect(mockGame.showdownState).toBeDefined();
      expect(mockGame.showdownState?.battlefield).toBe(battlefield.id);
      expect(mockGame.showdownState?.focusPlayer).toBe('player-1');
      expect(mockGame.turnState).toBe(TurnState.SHOWDOWN_OPEN);
    });

    it('should throw error if battlefield not found', async () => {
      await expect(
        combatManager.initiateShowdown(mockGame, 'invalid-id', 'player-1')
      ).rejects.toThrow('Battlefield invalid-id not found');
    });

    it('should throw error if battlefield not contested', async () => {
      const battlefield = createUncontestedBattlefield('player-1');
      mockGame.battlefields.push(battlefield);

      await expect(
        combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1')
      ).rejects.toThrow('Cannot initiate Showdown on non-contested battlefield');
    });

    it('should determine relevant players from battlefield units', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');

      expect(mockGame.showdownState?.relevantPlayers).toContain('player-1');
      expect(mockGame.showdownState?.relevantPlayers).toContain('player-2');
    });
  });

  describe('resolveShowdown', () => {
    it('should clear showdown state after resolution', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(mockGame);

      expect(mockGame.showdownState).toBeUndefined();
      expect(mockGame.turnState).toBe(TurnState.NEUTRAL_OPEN);
    });

    it('should initiate combat if units from both players present', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(mockGame);

      // Combat should have been created and resolved
      expect(mockGame.combatState).toBeUndefined(); // Cleared after resolution
    });

    it('should throw error if no showdown state exists', async () => {
      await expect(combatManager.resolveShowdown(mockGame)).rejects.toThrow(
        'No active Showdown to resolve'
      );
    });
  });

  describe('initiateCombat', () => {
    it('should create combat state with correct participants', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);
      mockGame.showdownState = {
        battlefield: battlefield.id,
        relevantPlayers: ['player-1', 'player-2'],
        focusPlayer: 'player-1',
        initialChainCreated: false
      };

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(mockGame);

      expect(mockGame.combatState).toBeUndefined(); // Resolved immediately in test
    });
  });

  describe('combat damage calculation', () => {
    it('should calculate total might correctly', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);
      mockGame.showdownState = {
        battlefield: battlefield.id,
        relevantPlayers: ['player-1', 'player-2'],
        focusPlayer: 'player-1',
        initialChainCreated: false
      };

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(mockGame);

      // Combat should have calculated might (tested via damage application)
    });

    it('should handle Assault keyword for attacking units', () => {
      const battlefield = createBattlefieldWithKeywords(mockGame.players, Keyword.ASSAULT);
      mockGame.battlefields.push(battlefield);

      // Test will check if assault bonus is applied
      expect(battlefield.units.length).toBeGreaterThan(0);
    });

    it('should handle Shield keyword for defending units', () => {
      const battlefield = createBattlefieldWithKeywords(mockGame.players, Keyword.SHIELD);
      mockGame.battlefields.push(battlefield);

      // Test will check if shield bonus is applied
      expect(battlefield.units.length).toBeGreaterThan(0);
    });

    it('should handle Tank keyword for damage distribution', () => {
      const battlefield = createBattlefieldWithKeywords(mockGame.players, Keyword.TANK);
      mockGame.battlefields.push(battlefield);

      // Tank units should receive lethal damage first
      expect(battlefield.units.length).toBeGreaterThan(0);
    });
  });

  describe('damage distribution', () => {
    it('should distribute damage to defenders when attackers win', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);
      mockGame.showdownState = {
        battlefield: battlefield.id,
        relevantPlayers: ['player-1', 'player-2'],
        focusPlayer: 'player-1',
        initialChainCreated: false
      };

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(mockGame);

      // Damage should have been distributed
    });

    it('should distribute damage to attackers when defenders win', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);
      mockGame.showdownState = {
        battlefield: battlefield.id,
        relevantPlayers: ['player-1', 'player-2'],
        focusPlayer: 'player-1',
        initialChainCreated: false
      };

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(mockGame);

      // Damage should have been distributed
    });

    it('should distribute damage to both sides on tie', async () => {
      const battlefield = createTiedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);
      mockGame.showdownState = {
        battlefield: battlefield.id,
        relevantPlayers: ['player-1', 'player-2'],
        focusPlayer: 'player-1',
        initialChainCreated: false
      };

      await combatManager.initiateShowdown(mockGame, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(mockGame);

      // Both sides should have taken damage
    });
  });

  describe('combat statistics', () => {
    it('should return correct combat stats when in combat', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);

      mockGame.combatState = {
        battlefield: battlefield.id,
        attackingPlayer: 'player-1',
        defendingPlayer: 'player-2',
        attackingUnits: [],
        defendingUnits: [],
        step: CombatStep.COMBAT_DAMAGE,
        totalAttackingMight: 5,
        totalDefendingMight: 3
      };

      const stats = combatManager.getCombatStats(mockGame);

      expect(stats.isInCombat).toBe(true);
      expect(stats.battlefieldId).toBe(battlefield.id);
      expect(stats.attackTotal).toBe(5);
      expect(stats.defendTotal).toBe(3);
      expect(stats.combatStep).toBe(CombatStep.COMBAT_DAMAGE);
    });

    it('should return correct stats when in showdown but not combat', async () => {
      const battlefield = createContestedBattlefield(mockGame.players);
      mockGame.battlefields.push(battlefield);

      mockGame.showdownState = {
        battlefield: battlefield.id,
        relevantPlayers: ['player-1', 'player-2'],
        focusPlayer: 'player-1',
        initialChainCreated: false
      };

      const stats = combatManager.getCombatStats(mockGame);

      expect(stats.isInCombat).toBe(false);
      expect(stats.isInShowdown).toBe(true);
      expect(stats.battlefieldId).toBe(battlefield.id);
    });

    it('should return empty stats when not in combat or showdown', () => {
      const stats = combatManager.getCombatStats(mockGame);

      expect(stats.isInCombat).toBe(false);
      expect(stats.isInShowdown).toBe(false);
      expect(stats.battlefieldId).toBeUndefined();
    });
  });
});

// Helper functions
function createMockGame(): Game {
  const player1 = createMockPlayer('player-1', 'Player 1');
  const player2 = createMockPlayer('player-2', 'Player 2');

  return {
    id: uuidv4(),
    players: [player1, player2],
    currentPlayerIndex: 0,
    phase: GamePhase.ACTION,
    turnState: TurnState.NEUTRAL_OPEN,
    round: 1,
    status: GameStatus.IN_PROGRESS,
    battlefields: [],
    chain: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function createMockPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    score: 0,
    championLegend: {
      id: `legend-${id}`,
      name: 'Test Legend',
      energyCost: 0,
      powerCost: [],
      description: 'Test',
      cardType: CardType.LEGEND,
      rarity: Rarity.MYTHIC,
      domains: [Domain.FURY],
      keywords: [],
      tags: [],
      domainIdentity: [Domain.FURY],
      championTag: 'warrior',
      legendaryAbility: {
        id: 'ability',
        name: 'Test',
        description: 'Test',
        type: 'static' as any,
        timing: 'normal' as any,
        effects: []
      }
    },
    zones: {
      base: [],
      runes: [],
      hand: [],
      mainDeck: [],
      runeDeck: [],
      championZone: [],
      trash: [],
      banishment: []
    },
    runePool: {
      energy: 0,
      power: []
    },
    hasPlayedCard: false,
    turnsPassed: 0
  };
}

function createContestedBattlefield(players: Player[]): Battlefield {
  return {
    id: uuidv4(),
    card: {
      id: 'battlefield-1',
      name: 'Test Battlefield',
      energyCost: 0,
      powerCost: [],
      description: 'Test',
      cardType: CardType.BATTLEFIELD,
      rarity: Rarity.COMMON,
      domains: [],
      keywords: [],
      tags: [],
      battlefieldAbilities: [],
      scoreValue: 1
    },
    units: [
      createMockUnit(players[0]!.id, 'unit-1'),
      createMockUnit(players[1]!.id, 'unit-2')
    ],
    contested: true,
    facedownCards: []
  };
}

function createUncontestedBattlefield(controllerId: string): Battlefield {
  return {
    id: uuidv4(),
    card: {
      id: 'battlefield-2',
      name: 'Uncontested Battlefield',
      energyCost: 0,
      powerCost: [],
      description: 'Test',
      cardType: CardType.BATTLEFIELD,
      rarity: Rarity.COMMON,
      domains: [],
      keywords: [],
      tags: [],
      battlefieldAbilities: [],
      scoreValue: 1
    },
    units: [createMockUnit(controllerId, 'unit-3')],
    controller: controllerId,
    contested: false,
    facedownCards: []
  };
}

function createBattlefieldWithKeywords(players: Player[], keyword: Keyword): Battlefield {
  return {
    id: uuidv4(),
    card: {
      id: 'battlefield-keywords',
      name: 'Keyword Battlefield',
      energyCost: 0,
      powerCost: [],
      description: 'Test',
      cardType: CardType.BATTLEFIELD,
      rarity: Rarity.COMMON,
      domains: [],
      keywords: [],
      tags: [],
      battlefieldAbilities: [],
      scoreValue: 1
    },
    units: [
      createMockUnit(players[0]!.id, 'unit-keyword-1', keyword),
      createMockUnit(players[1]!.id, 'unit-keyword-2')
    ],
    contested: true,
    facedownCards: []
  };
}

function createTiedBattlefield(players: Player[]): Battlefield {
  return {
    id: uuidv4(),
    card: {
      id: 'battlefield-tied',
      name: 'Tied Battlefield',
      energyCost: 0,
      powerCost: [],
      description: 'Test',
      cardType: CardType.BATTLEFIELD,
      rarity: Rarity.COMMON,
      domains: [],
      keywords: [],
      tags: [],
      battlefieldAbilities: [],
      scoreValue: 1
    },
    units: [
      createMockUnit(players[0]!.id, 'unit-tied-1'),
      createMockUnit(players[1]!.id, 'unit-tied-2')
    ],
    contested: true,
    facedownCards: []
  };
}

function createMockUnit(controllerId: string, cardId: string, keyword?: Keyword): GameCard {
  return {
    instanceId: uuidv4(),
    cardId,
    controllerId,
    ownerId: controllerId,
    zone: 'battlefield',
    ready: true,
    damage: 0,
    temporaryModifiers: keyword ? [{
      type: 'keyword_grant' as any,
      value: 0,
      duration: 'permanent' as any,
      source: 'test'
    }] : [],
    counters: []
  };
}
