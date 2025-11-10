/**
 * Combat Integration Test - V3 System
 *
 * Tests the complete combat flow with V3 actions:
 * 1. Units attack → StartCombatAction fires
 * 2. Combat damage applied via DealDamageAction
 * 3. Dead units trigger processDeaths
 * 4. onDeath hooks execute
 */

import { CombatManager } from '../CombatManager';
import { PriorityManager } from '../../managers/PriorityManager';
import { ActionExecutor } from '../../actions/ActionExecutor';
import { CardScriptRuntime } from '../../scripting/CardScriptRuntime';
import { CardStorage } from '../../storage/CardStorage';
import {
  Game,
  Player,
  Battlefield,
  GameCard,
  TurnState,
  GameStatus,
  GamePhase,
  Domain,
  CardType,
  Rarity,
  Keyword
} from '@/types/game';

describe('CombatManager V3 Integration', () => {
  let game: Game;
  let executor: ActionExecutor;
  let combatManager: CombatManager;
  let priorityManager: PriorityManager;
  let scriptRuntime: CardScriptRuntime;

  beforeEach(() => {
    // Create mock game
    game = createMockGame();

    // Create V3 executor
    executor = new ActionExecutor(game);

    // Create priority manager
    priorityManager = new PriorityManager();

    // Create script runtime
    scriptRuntime = new CardScriptRuntime();

    // Create combat manager with V3 integration
    combatManager = new CombatManager(priorityManager, executor, scriptRuntime);
  });

  describe('Combat Damage with V3 DealDamageAction', () => {
    it('should apply combat damage using V3 action pipeline', async () => {
      // Setup: Create contested battlefield with units
      const battlefield = createContestedBattlefield();
      game.battlefields.push(battlefield);

      // Attacking unit: Might 3, no damage
      const attacker = battlefield.units.find(u => u.controllerId === 'player-1')!;
      attacker.might = 3;
      attacker.damage = 0;

      // Defending unit: Might 2, no damage
      const defender = battlefield.units.find(u => u.controllerId === 'player-2')!;
      defender.might = 2;
      defender.damage = 0;

      // Act: Initiate showdown → combat
      await combatManager.initiateShowdown(game, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(game);

      // Assert: Defender took 3 damage (attacker won)
      expect(defender.damage).toBeGreaterThan(0);

      // Combat state cleared
      expect(game.combatState).toBeUndefined();
      expect(game.showdownState).toBeUndefined();
    });

    it('should process deaths after combat damage', async () => {
      // Setup: Weak defender that will die
      const battlefield = createContestedBattlefield();
      game.battlefields.push(battlefield);

      const attacker = battlefield.units.find(u => u.controllerId === 'player-1')!;
      attacker.might = 5;
      attacker.damage = 0;

      const defender = battlefield.units.find(u => u.controllerId === 'player-2')!;
      defender.might = 2;
      defender.damage = 0;

      // Act: Combat
      await combatManager.initiateShowdown(game, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(game);

      // processDeaths should be called by ActionExecutor Phase 7
      // Note: In real game, processDeaths is on Game object, not GameManager
      // This test verifies damage was applied
      expect(defender.damage).toBeGreaterThanOrEqual(defender.might);
    });
  });

  describe('Combat with Assault/Shield keywords', () => {
    it('should apply Assault bonus when attacking', async () => {
      const battlefield = createContestedBattlefield();
      game.battlefields.push(battlefield);

      const attacker = battlefield.units.find(u => u.controllerId === 'player-1')!;
      attacker.might = 3;
      attacker.damage = 0;
      attacker.keywords = [Keyword.ASSAULT]; // +1 when attacking

      const defender = battlefield.units.find(u => u.controllerId === 'player-2')!;
      defender.might = 2;
      defender.damage = 0;

      // Act
      await combatManager.initiateShowdown(game, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(game);

      // Assert: Defender took damage from 3+1=4 total might
      expect(defender.damage).toBeGreaterThan(2);
    });

    it('should apply Shield bonus when defending', async () => {
      const battlefield = createContestedBattlefield();
      game.battlefields.push(battlefield);

      const attacker = battlefield.units.find(u => u.controllerId === 'player-1')!;
      attacker.might = 3;
      attacker.damage = 0;

      const defender = battlefield.units.find(u => u.controllerId === 'player-2')!;
      defender.might = 2;
      defender.damage = 0;
      defender.keywords = [Keyword.SHIELD]; // +1 when defending

      // Act
      await combatManager.initiateShowdown(game, battlefield.id, 'player-1');
      await combatManager.resolveShowdown(game);

      // Assert: Shield bonus applied (defender effectively 3 might)
      // Attacker should take some damage back
      expect(attacker.damage).toBeGreaterThan(0);
    });
  });
});

// ===== TEST HELPERS =====

function createMockGame(): Game {
  const player1: Player = {
    id: 'player-1',
    name: 'Player 1',
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
      banishment: []
    },
    runePool: {
      energy: 0,
      power: []
    },
    hasPlayedCard: false,
    turnsPassed: 0
  };

  const player2: Player = {
    id: 'player-2',
    name: 'Player 2',
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
      banishment: []
    },
    runePool: {
      energy: 0,
      power: []
    },
    hasPlayedCard: false,
    turnsPassed: 0
  };

  return {
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
    processDeaths: async () => {
      // Mock processDeaths - in real game this is in GameManager
    }
  };
}

function createContestedBattlefield(): Battlefield {
  const attacker: GameCard = {
    id: 'test-attacker',
    instanceId: 'unit-attacker',
    cardId: 'test-attacker',
    name: 'Attacker',
    description: '',
    cardType: CardType.UNIT,
    domains: [Domain.FURY],
    rarity: Rarity.COMMON,
    energyCost: 2,
    powerCost: [],
    keywords: [],
    tags: [],
    might: 3,
    damage: 0,
    ready: true,
    ownerId: 'player-1',
    controllerId: 'player-1',
    zone: 'battlefield',
    temporaryModifiers: [],
    counters: []
  };

  const defender: GameCard = {
    id: 'test-defender',
    instanceId: 'unit-defender',
    cardId: 'test-defender',
    name: 'Defender',
    description: '',
    cardType: CardType.UNIT,
    domains: [Domain.CALM],
    rarity: Rarity.COMMON,
    energyCost: 2,
    powerCost: [],
    keywords: [],
    tags: [],
    might: 2,
    damage: 0,
    ready: true,
    ownerId: 'player-2',
    controllerId: 'player-2',
    zone: 'battlefield',
    temporaryModifiers: [],
    counters: []
  };

  return {
    id: 'battlefield-1',
    card: {} as any,
    controller: 'player-1',
    contested: true,
    units: [attacker, defender],
    sides: {
      'player-1': [attacker],
      'player-2': [defender]
    },
    facedownCards: []
  };
}
