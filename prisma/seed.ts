/**
 * Prisma Database Seed Script
 *
 * Seeds the database with:
 * - Base card definitions (10 cards)
 * - Test users
 */

import { PrismaClient, CardType, Rarity } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // Seed Card Definitions
  // ============================================================================

  console.log('\n📦 Seeding card definitions...');

  const cards = [
    // 1-6: All 6 basic runes
    {
      id: 'BASIC_RUNE_FURY',
      name: 'Fury Rune',
      cardType: CardType.RUNE,
      rarity: Rarity.COMMON,
      energyCost: 0,
      powerCosts: [],
      description: '[T]: Add [1] energy. Recycle this: Add [Fury] power.',
      flavorText: null,
      might: null,
      subtypes: [],
      domains: ['fury'],
      keywords: [],
      tags: ['rune', 'basic'],
      scriptPath: 'cards/basic-rune.ts',
      hasScript: true,
      imageUrl: null,
      artist: null,
      cardNumber: 'R-FURY',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: true,
    },

    {
      id: 'BASIC_RUNE_CALM',
      name: 'Calm Rune',
      cardType: CardType.RUNE,
      rarity: Rarity.COMMON,
      energyCost: 0,
      powerCosts: [],
      description: '[T]: Add [1] energy. Recycle this: Add [Calm] power.',
      flavorText: null,
      might: null,
      subtypes: [],
      domains: ['calm'],
      keywords: [],
      tags: ['rune', 'basic'],
      scriptPath: 'cards/basic-rune.ts',
      hasScript: true,
      imageUrl: null,
      artist: null,
      cardNumber: 'R-CALM',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: true,
    },

    {
      id: 'BASIC_RUNE_MIND',
      name: 'Mind Rune',
      cardType: CardType.RUNE,
      rarity: Rarity.COMMON,
      energyCost: 0,
      powerCosts: [],
      description: '[T]: Add [1] energy. Recycle this: Add [Mind] power.',
      flavorText: null,
      might: null,
      subtypes: [],
      domains: ['mind'],
      keywords: [],
      tags: ['rune', 'basic'],
      scriptPath: 'cards/basic-rune.ts',
      hasScript: true,
      imageUrl: null,
      artist: null,
      cardNumber: 'R-MIND',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: true,
    },

    {
      id: 'BASIC_RUNE_BODY',
      name: 'Body Rune',
      cardType: CardType.RUNE,
      rarity: Rarity.COMMON,
      energyCost: 0,
      powerCosts: [],
      description: '[T]: Add [1] energy. Recycle this: Add [Body] power.',
      flavorText: null,
      might: null,
      subtypes: [],
      domains: ['body'],
      keywords: [],
      tags: ['rune', 'basic'],
      scriptPath: 'cards/basic-rune.ts',
      hasScript: true,
      imageUrl: null,
      artist: null,
      cardNumber: 'R-BODY',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: true,
    },

    {
      id: 'BASIC_RUNE_CHAOS',
      name: 'Chaos Rune',
      cardType: CardType.RUNE,
      rarity: Rarity.COMMON,
      energyCost: 0,
      powerCosts: [],
      description: '[T]: Add [1] energy. Recycle this: Add [Chaos] power.',
      flavorText: null,
      might: null,
      subtypes: [],
      domains: ['chaos'],
      keywords: [],
      tags: ['rune', 'basic'],
      scriptPath: 'cards/basic-rune.ts',
      hasScript: true,
      imageUrl: null,
      artist: null,
      cardNumber: 'R-CHAOS',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: true,
    },

    {
      id: 'BASIC_RUNE_ORDER',
      name: 'Order Rune',
      cardType: CardType.RUNE,
      rarity: Rarity.COMMON,
      energyCost: 0,
      powerCosts: [],
      description: '[T]: Add [1] energy. Recycle this: Add [Order] power.',
      flavorText: null,
      might: null,
      subtypes: [],
      domains: ['order'],
      keywords: [],
      tags: ['rune', 'basic'],
      scriptPath: 'cards/basic-rune.ts',
      hasScript: true,
      imageUrl: null,
      artist: null,
      cardNumber: 'R-ORDER',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: true,
    },

    // 7: Jinx, Loose Cannon (Legend - fury+chaos)
    {
      id: 'JINX_LOOSE_CANNON',
      name: 'Jinx, Loose Cannon',
      cardType: CardType.LEGEND,
      rarity: Rarity.MYTHIC,
      energyCost: 0,
      powerCosts: [],
      description: 'When you play me, discard 2.',
      flavorText: 'Rules are made to be broken... like buildings! Or people!',
      might: null,
      subtypes: [],
      domains: ['fury', 'chaos'],
      keywords: [],
      tags: ['jinx', 'champion_legend'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: 'Riot Games',
      cardNumber: 'L-JINX',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 8: Yasuo, Unforgiven (Legend - calm+chaos)
    {
      id: 'YASUO_UNFORGIVEN',
      name: 'Yasuo, Unforgiven',
      cardType: CardType.LEGEND,
      rarity: Rarity.MYTHIC,
      energyCost: 0,
      powerCosts: [],
      description: 'When I attack, deal damage equal to my Might to an enemy unit here.',
      flavorText: 'Death is like the wind - always by my side.',
      might: null,
      subtypes: [],
      domains: ['calm', 'chaos'],
      keywords: [],
      tags: ['yasuo', 'champion_legend'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: 'Riot Games',
      cardNumber: 'L-YASUO',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 9: Altar to Unity (Battlefield)
    {
      id: 'ALTAR_TO_UNITY',
      name: 'Altar to Unity',
      cardType: CardType.BATTLEFIELD,
      rarity: Rarity.COMMON,
      energyCost: 0,
      powerCosts: [],
      description: 'Units gain +1 might for each different domain among your units. Control: Score 1 point.',
      flavorText: 'Strength in diversity.',
      might: null,
      subtypes: [],
      domains: ['universal'],
      keywords: [],
      tags: ['battlefield', 'altar'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: 'Sacred Designs',
      cardNumber: 'BF-ALTAR',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 10: Grove of the God-Willow (Battlefield)
    {
      id: 'GROVE_GOD_WILLOW',
      name: 'Grove of the God-Willow',
      cardType: CardType.BATTLEFIELD,
      rarity: Rarity.UNCOMMON,
      energyCost: 0,
      powerCosts: [],
      description: 'At the start of your turn, heal 1 damage from all your units. Control: Score 1 point.',
      flavorText: 'Ancient roots, eternal life.',
      might: null,
      subtypes: [],
      domains: ['body', 'order'],
      keywords: [],
      tags: ['battlefield', 'grove'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: 'Nature\'s Canvas',
      cardNumber: 'BF-GROVE',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 11: Recruit (Token - 1 might)
    {
      id: 'RECRUIT_TOKEN',
      name: 'Recruit',
      cardType: CardType.TOKEN,
      rarity: Rarity.COMMON,
      energyCost: 0,
      powerCosts: [],
      description: 'Token unit.',
      flavorText: 'Ready to serve.',
      might: 1,
      subtypes: ['soldier'],
      domains: ['universal'],
      keywords: [],
      tags: ['token', 'recruit'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: null,
      cardNumber: 'T-RECRUIT',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 12: Jinx, Demolitionist (Champion - fury, 3E+1fury, 4 might)
    {
      id: 'JINX_DEMOLITIONIST',
      name: 'Jinx, Demolitionist',
      cardType: CardType.CHAMPION,
      rarity: Rarity.RARE,
      energyCost: 3,
      powerCosts: [{ domain: 'fury', amount: 1 }],
      description: 'When Jinx enters play, deal 2 damage to all enemy units.',
      flavorText: 'Jinx? Stands for Jinx! Durr.',
      might: 4,
      subtypes: ['champion', 'jinx'],
      domains: ['fury'],
      keywords: [],
      tags: ['jinx', 'champion'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: 'Riot Games',
      cardNumber: 'C-JINX',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 13: Yasuo, Remorseful (Champion - calm, 6E+2calm, 6 might)
    {
      id: 'YASUO_REMORSEFUL',
      name: 'Yasuo, Remorseful',
      cardType: CardType.CHAMPION,
      rarity: Rarity.RARE,
      energyCost: 6,
      powerCosts: [{ domain: 'calm', amount: 2 }],
      description: 'When Yasuo enters play, stun all enemy units for 1 turn.',
      flavorText: 'The road to ruin is shorter than you think.',
      might: 6,
      subtypes: ['champion', 'yasuo'],
      domains: ['calm'],
      keywords: [],
      tags: ['yasuo', 'champion'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: 'Riot Games',
      cardNumber: 'C-YASUO',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 14: Pouty Poro (Unit - fury, 2E, 2 might)
    {
      id: 'POUTY_PORO',
      name: 'Pouty Poro',
      cardType: CardType.UNIT,
      rarity: Rarity.COMMON,
      energyCost: 2,
      powerCosts: [],
      description: 'A grumpy little fluffball.',
      flavorText: '*Angry poro noises*',
      might: 2,
      subtypes: ['poro'],
      domains: ['fury'],
      keywords: [],
      tags: ['poro', 'fury'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: 'Riot Games',
      cardNumber: 'U-PPORO',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 15: Mystic Poro (Unit - chaos, 3E, 3 might)
    {
      id: 'MYSTIC_PORO',
      name: 'Mystic Poro',
      cardType: CardType.UNIT,
      rarity: Rarity.COMMON,
      energyCost: 3,
      powerCosts: [],
      description: 'A magical poro with mysterious powers.',
      flavorText: 'Even poros can learn magic.',
      might: 3,
      subtypes: ['poro'],
      domains: ['chaos'],
      keywords: [],
      tags: ['poro', 'chaos'],
      scriptPath: null,
      hasScript: false,
      imageUrl: null,
      artist: 'Riot Games',
      cardNumber: 'U-MPORO',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },

    // 16: Playful Phantom (Unit - calm, 5E, 5 might)
    {
      id: 'PLAYFUL_PHANTOM',
      name: 'Playful Phantom',
      cardType: CardType.UNIT,
      rarity: Rarity.COMMON,
      energyCost: 5,
      powerCosts: [],
      description: 'A simple vanilla unit.',
      flavorText: 'Ethereal and playful, yet mighty.',
      might: 5,
      subtypes: ['spirit'],
      domains: ['calm'],
      keywords: [],
      tags: ['spirit', 'calm'],
      scriptPath: 'cards/playful-phantom.ts',
      hasScript: true,
      imageUrl: null,
      artist: null,
      cardNumber: 'U-PHANTOM',
      setCode: 'BASE',
      setName: 'Base Set',
      isSignature: false,
      isBasicRune: false,
    },
  ];

  for (const card of cards) {
    await prisma.cardDefinition.upsert({
      where: { id: card.id },
      update: card,
      create: card,
    });
    console.log(`  ✓ ${card.name} (${card.cardType})`);
  }

  console.log(`\n✅ Seeded ${cards.length} cards`);

  // ============================================================================
  // Seed Test Users (optional)
  // ============================================================================

  console.log('\n👤 Seeding test users...');

  const testUsers = [
    {
      id: 'test-user-1',
      email: 'player1@test.com',
      username: 'player1',
      passwordHash: '$2a$10$test.hash.placeholder', // In production, use bcrypt
      displayName: 'Test Player 1',
      avatarUrl: null,
    },
    {
      id: 'test-user-2',
      email: 'player2@test.com',
      username: 'player2',
      passwordHash: '$2a$10$test.hash.placeholder',
      displayName: 'Test Player 2',
      avatarUrl: null,
    },
  ];

  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
    console.log(`  ✓ ${user.username}`);
  }

  console.log(`\n✅ Seeded ${testUsers.length} users`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
