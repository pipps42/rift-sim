/**
 * Example: Chain System Usage
 *
 * This example demonstrates how the Chain System, Priority Manager, and Action Validator
 * work together to handle spell and ability resolution in Riftbound.
 */

import {
  Game,
  ChainItem,
  ChainItemType,
  SpellTiming,
  GamePhase,
  TurnState,
  GameStatus,
  PriorityReason
} from '../types/game';
import { ChainSystem } from '../engine/systems/ChainSystem';
import { PriorityManager } from '../engine/managers/PriorityManager';
import { ActionValidator } from '../engine/validators/ActionValidator';
import { RunePoolManager } from '../engine/managers/RunePoolManager';
import { v4 as uuidv4 } from 'uuid';

async function runChainSystemExample() {
  console.log('=== Riftbound Chain System Example ===\n');

  // Initialize systems
  const chainSystem = new ChainSystem();
  const priorityManager = new PriorityManager();
  const runePoolManager = new RunePoolManager();
  const actionValidator = new ActionValidator(runePoolManager, priorityManager);

  // Create a mock game state
  const game = createMockGame();

  console.log('1. Initial game state');
  console.log(`   Phase: ${game.phase}`);
  console.log(`   Turn State: ${game.turnState}`);
  console.log(`   Current Player: ${game.players[game.currentPlayerIndex].name}\n`);

  // Set up Action Phase
  game.phase = GamePhase.ACTION;
  game.turnState = TurnState.NEUTRAL_OPEN;
  priorityManager.resetForActionPhase(game);
  await priorityManager.assignPriority(game, game.players[0].id, PriorityReason.ACTION_PHASE);

  console.log('2. Player 1 plays a Normal spell');
  const spell1: ChainItem = createSpellChainItem(
    'Fireball',
    game.players[0].id,
    SpellTiming.NORMAL
  );

  const canPlay1 = chainSystem.push(game, spell1);
  console.log(`   Spell added to chain: ${canPlay1}`);
  console.log(`   Turn State changed to: ${game.turnState}`);
  console.log(`   Chain depth: ${chainSystem.getDepth()}\n`);

  console.log('3. Player 2 responds with a Reaction spell');
  const spell2: ChainItem = createSpellChainItem(
    'Counterspell',
    game.players[1].id,
    SpellTiming.REACTION
  );

  const canPlay2 = chainSystem.push(game, spell2);
  console.log(`   Spell added to chain: ${canPlay2}`);
  console.log(`   Chain depth: ${chainSystem.getDepth()}\n`);

  console.log('4. Chain Statistics:');
  const stats = chainSystem.getStats();
  console.log(`   Total items: ${stats.depth}`);
  console.log(`   Spells: ${stats.itemsByType[ChainItemType.SPELL]}`);
  console.log(`   Player 1 items: ${stats.itemsByPlayer[game.players[0].id]}`);
  console.log(`   Player 2 items: ${stats.itemsByPlayer[game.players[1].id]}\n`);

  console.log('5. Resolving the chain (LIFO order)...');
  console.log('   Last item resolves first: Counterspell');
  console.log('   Then: Fireball\n');

  await chainSystem.resolve(game);

  console.log('6. After chain resolution:');
  console.log(`   Chain is empty: ${chainSystem.isEmpty()}`);
  console.log(`   Turn State returned to: ${game.turnState}\n`);

  console.log('7. Priority System:');
  const priorityInfo = priorityManager.getPriorityInfo(game);
  console.log(`   Current player with priority: Player ${priorityInfo.currentPlayer === game.players[0].id ? '1' : '2'}`);
  console.log(`   Relevant players: ${priorityInfo.relevantPlayers.length}`);
  console.log(`   Player 1 can act: ${priorityInfo.canAct[game.players[0].id]}`);
  console.log(`   Player 2 can act: ${priorityInfo.canAct[game.players[1].id]}\n`);

  console.log('8. Showdown Example:');
  game.turnState = TurnState.SHOWDOWN_OPEN;
  priorityManager.resetForShowdown(
    game,
    game.players[0].id,
    [game.players[0].id, game.players[1].id]
  );

  console.log(`   Turn State: ${game.turnState}`);
  console.log(`   Focus Player: Player 1`);

  const actionSpell: ChainItem = createSpellChainItem(
    'Battle Cry',
    game.players[0].id,
    SpellTiming.ACTION
  );

  const canPlayAction = chainSystem.push(game, actionSpell);
  console.log(`   Action timing spell added: ${canPlayAction}`);
  console.log(`   Chain depth: ${chainSystem.getDepth()}\n`);

  await chainSystem.resolve(game);
  console.log('   Showdown chain resolved\n');

  console.log('9. Action Validation Example:');
  game.turnState = TurnState.NEUTRAL_OPEN;
  game.phase = GamePhase.ACTION;

  const validation1 = actionValidator.validatePlayerHasPriority(game, game.players[0].id);
  console.log(`   Player 1 has priority: ${validation1.isValid}`);

  const validation2 = actionValidator.validatePlayerHasPriority(game, game.players[1].id);
  console.log(`   Player 2 has priority: ${validation2.isValid}`);
  if (!validation2.isValid) {
    console.log(`   Errors: ${validation2.errors.join(', ')}\n`);
  }

  console.log('=== Chain System Example Complete ===');
}

// Helper functions
function createMockGame(): Game {
  return {
    id: uuidv4(),
    players: [
      {
        id: 'player-1',
        name: 'Player 1',
        score: 0,
        championLegend: {} as any,
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
        runePool: { energy: 10, power: [] },
        hasPlayedCard: false,
        turnsPassed: 0
      },
      {
        id: 'player-2',
        name: 'Player 2',
        score: 0,
        championLegend: {} as any,
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
        runePool: { energy: 10, power: [] },
        hasPlayedCard: false,
        turnsPassed: 0
      }
    ],
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

function createSpellChainItem(
  name: string,
  controllerId: string,
  timing: SpellTiming
): ChainItem {
  return {
    id: uuidv4(),
    type: ChainItemType.SPELL,
    sourceCardId: uuidv4(),
    controllerId,
    targets: [],
    effects: [{
      type: 'DAMAGE' as any,
      description: `${name} effect`,
      value: 3
    }],
    spellTiming: timing,
    timestamp: new Date(),
    resolved: false
  };
}

// Run the example
runChainSystemExample().catch(console.error);
