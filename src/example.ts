/**
 * Example demonstrating Riftbound Engine functionality
 */
import { gameManager } from './engine/managers/GameManager.js';
import { Player, Deck, GameCard, ChampionLegendCard, UnitCard } from './types/game.js';
import { logger } from './utils/logger.js';

// Create mock champion legend
const createMockChampionLegend = (playerId: string): ChampionLegendCard => ({
  id: `legend-${playerId}`,
  name: `Champion Legend ${playerId}`,
  energyCost: 0,
  powerCost: [],
  description: 'A legendary champion leading the battle',
  cardType: 'champion_legend' as any,
  rarity: 'mythic' as any,
  domains: ['fire' as any],
  keywords: [],
  tags: ['warrior'],
  domainIdentity: ['fire' as any],
  championTag: 'warrior',
  legendaryAbility: {
    id: 'legendary-ability',
    name: 'Legendary Power',
    description: 'A powerful legendary ability',
    type: 'static' as any,
    timing: 'normal' as any,
    effects: []
  }
});

// Create mock chosen champion
const createMockChosenChampion = (playerId: string): UnitCard => ({
  id: `champion-${playerId}`,
  name: `Chosen Champion ${playerId}`,
  energyCost: 3,
  powerCost: [{ domain: 'fire' as any, amount: 1 }],
  description: 'A mighty chosen champion',
  cardType: 'unit' as any,
  rarity: 'rare' as any,
  domains: ['fire' as any],
  keywords: [],
  tags: ['warrior', 'champion'],
  might: 4,
  subtypes: ['warrior' as any, 'champion' as any],
  abilities: []
});

// Create mock game cards for deck
const createMockGameCards = (playerId: string, count: number, prefix: string): GameCard[] => {
  return Array.from({ length: count }, (_, i) => ({
    instanceId: `${prefix}-${playerId}-${i}`,
    cardId: `${prefix}-card-${i}`,
    controllerId: playerId,
    ownerId: playerId,
    zone: prefix === 'main' ? 'mainDeck' : 'runeDeck',
    ready: false,
    damage: 0,
    temporaryModifiers: [],
    counters: []
  }));
};

// Create complete mock player
const createMockPlayer = (id: string, name: string): Player => {
  const championLegend = createMockChampionLegend(id);
  const chosenChampion = createMockChosenChampion(id);

  return {
    id,
    name,
    score: 0,
    championLegend,
    chosenChampion,
    zones: {
      base: [],
      runes: [],
      hand: [],
      mainDeck: createMockGameCards(id, 40, 'main'),
      runeDeck: createMockGameCards(id, 12, 'rune'),
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
};

// Create mock deck definition
const createMockDeck = (playerId: string): Deck => ({
  id: `deck-${playerId}`,
  name: `${playerId}'s Test Deck`,
  playerId,
  championLegend: `legend-${playerId}`,
  chosenChampion: `champion-${playerId}`,
  mainDeck: Array.from({ length: 40 }, (_, i) => ({
    cardId: `main-card-${i}`,
    quantity: 1
  })),
  runeDeck: Array.from({ length: 12 }, (_, i) => ({
    cardId: `rune-card-${i}`,
    quantity: 1
  })),
  battlefields: ['battlefield-1', 'battlefield-2', 'battlefield-3'],
  isValid: true,
  validationErrors: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

async function runExample() {
  console.log('🎮 Starting Riftbound Engine Example...\n');

  try {
    // Create players
    const alice = createMockPlayer('player-alice', 'Alice');
    const bob = createMockPlayer('player-bob', 'Bob');

    console.log(`👤 Created players: ${alice.name} and ${bob.name}`);

    // Create decks
    const aliceDeck = createMockDeck('player-alice');
    const bobDeck = createMockDeck('player-bob');

    console.log(`🃏 Created decks for both players`);

    // Create game
    console.log('\n🎲 Creating new game...');
    const game = await gameManager.createGame([alice, bob], [aliceDeck, bobDeck]);

    console.log(`✅ Game created with ID: ${game.id}`);
    console.log(`   Status: ${game.status}`);
    console.log(`   Players: ${game.players.map(p => p.name).join(' vs ')}`);

    // Start game
    console.log('\n🚀 Starting game...');
    await gameManager.startGame(game.id);

    const startedGame = gameManager.getGame(game.id);
    console.log(`✅ Game started successfully!`);
    console.log(`   Status: ${startedGame?.status}`);
    console.log(`   Current Phase: ${startedGame?.phase}`);
    console.log(`   Turn: ${startedGame?.round}`);
    console.log(`   Current Player: ${startedGame?.players[startedGame.currentPlayerIndex]?.name}`);

    // Show initial setup
    console.log('\n📋 Initial Game State:');
    for (const player of startedGame?.players || []) {
      console.log(`   ${player.name}:`);
      console.log(`     Score: ${player.score}/8`);
      console.log(`     Hand: ${player.zones.hand.length} cards`);
      console.log(`     Main Deck: ${player.zones.mainDeck.length} cards`);
      console.log(`     Rune Deck: ${player.zones.runeDeck.length} cards`);
      console.log(`     Champion Legend: ${player.championLegend.name}`);
      console.log(`     Chosen Champion: ${player.chosenChampion?.name || 'None'}`);
    }

    // Show battlefields
    console.log('\n🏟️  Battlefields:');
    startedGame?.battlefields.forEach((battlefield, i) => {
      console.log(`   ${i + 1}. ${battlefield.card.name}`);
      console.log(`      Controller: ${battlefield.controller || 'None'}`);
      console.log(`      Units: ${battlefield.units.length}`);
      console.log(`      Contested: ${battlefield.contested}`);
    });

    // Show game manager statistics
    console.log('\n📊 Game Manager Statistics:');
    const stats = gameManager.getStatistics();
    console.log(`   Total Games: ${stats.totalGames}`);
    console.log(`   Active Games: ${stats.activeGames}`);
    console.log(`   Finished Games: ${stats.finishedGames}`);

    console.log('\n🎉 Example completed successfully! The Riftbound Engine is working correctly.');

    // Clean up
    await gameManager.endGame(game.id, 'Example completed');
    console.log('🧹 Game cleaned up.');

  } catch (error) {
    console.error('❌ Error running example:', error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runExample().catch(console.error);
}

export { runExample };