/**
 * TargetingSystem Unit Tests
 *
 * Tests for the core targeting system that handles:
 * - Finding valid targets based on requirements
 * - Validating selected targets
 * - Resolving target IDs to game objects
 * - Checking restrictions (domain, cost, keywords, etc.)
 * - Special target types (ChainItem, Battlefield, Player)
 */

import { TargetingSystem } from '../TargetingSystem';
import type {
  Game,
  Player,
  GameCard,
  Battlefield,
  ChainItem,
  Target,
  TargetRequirement,
  TargetRestriction,
  BattlefieldCard,
} from '../../../types/game';
import {
  CardType,
  Domain,
  Keyword,
  ChainItemType,
  TargetType,
  TargetProperty,
  ComparisonOperator,
} from '../../../types/game';
import { CardStorage } from '../../storage/CardStorage';
import { HistoryQueryAPI } from '../../history/HistoryQueryAPI';

describe('TargetingSystem', () => {
  let targetingSystem: TargetingSystem;
  let mockGame: Game;
  let player1: Player;
  let player2: Player;
  let storage: CardStorage;

  beforeEach(() => {
    targetingSystem = new TargetingSystem();
    storage = new CardStorage();

    // Create mock players
    player1 = createMockPlayer('player1', 'Player 1');
    player2 = createMockPlayer('player2', 'Player 2');

    // Create mock game
    mockGame = {
      id: 'test-game',
      players: [player1, player2] as [Player, Player],
      currentPlayerIndex: 0,
      currentTurn: 1,
      phase: 'action' as any,
      turnState: 'neutral_open' as any,
      round: 1,
      status: 'in_progress' as any,
      battlefields: [],
      chain: [],
      storage,
      history: [],
      historyQuery: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGame.historyQuery = new HistoryQueryAPI(mockGame);
  });

  describe('getValidTargets', () => {
    describe('Unit Targets', () => {
      it('should find all units on battlefields', () => {
        // Arrange: Create units on battlefield
        const unit1 = createMockCard('unit1', 'Unit 1', CardType.UNIT, player1.id);
        const unit2 = createMockCard('unit2', 'Unit 2', CardType.UNIT, player2.id);

        const battlefield = createMockBattlefield('bf1', player1.id);
        battlefield.units = [unit1, unit2];
        mockGame.battlefields = [battlefield];

        const requirement: TargetRequirement = {
          targetType: TargetType.UNIT,
          count: 1,
          optional: false,
          restrictions: [],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(2);
        expect(validTargets[0]?.id).toBe('unit1');
        expect(validTargets[1]?.id).toBe('unit2');
      });

      it('should filter units by domain restriction', () => {
        // Arrange
        const furyUnit = createMockCard('fury-unit', 'Fury Unit', CardType.UNIT, player1.id);
        furyUnit.domains = ['Fury' as Domain];

        const calmUnit = createMockCard('calm-unit', 'Calm Unit', CardType.UNIT, player2.id);
        calmUnit.domains = ['Calm' as Domain];

        const battlefield = createMockBattlefield('bf1', player1.id);
        battlefield.units = [furyUnit, calmUnit];
        mockGame.battlefields = [battlefield];

        const requirement: TargetRequirement = {
          targetType: TargetType.UNIT,
          count: 1,
          optional: false,
          restrictions: [
            {
              property: TargetProperty.DOMAIN,
              operator: ComparisonOperator.CONTAINS,
              value: 'Fury',
            },
          ],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(1);
        expect(validTargets[0]?.id).toBe('fury-unit');
      });

      it('should filter units by might (greater_than)', () => {
        // Arrange
        const weakUnit = createMockCard('weak', 'Weak Unit', CardType.UNIT, player1.id);
        weakUnit.might = 2;

        const strongUnit = createMockCard('strong', 'Strong Unit', CardType.UNIT, player2.id);
        strongUnit.might = 5;

        const battlefield = createMockBattlefield('bf1', player1.id);
        battlefield.units = [weakUnit, strongUnit];
        mockGame.battlefields = [battlefield];

        const requirement: TargetRequirement = {
          targetType: TargetType.UNIT,
          count: 1,
          optional: false,
          restrictions: [
            {
              property: TargetProperty.MIGHT,
              operator: ComparisonOperator.GREATER_THAN,
              value: 3,
            },
          ],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(1);
        expect(validTargets[0]?.id).toBe('strong');
      });

      it('should filter units by keyword', () => {
        // Arrange
        const tankUnit = createMockCard('tank', 'Tank Unit', CardType.UNIT, player1.id);
        tankUnit.keywords = [Keyword.TANK];

        const normalUnit = createMockCard('normal', 'Normal Unit', CardType.UNIT, player2.id);
        normalUnit.keywords = [];

        const battlefield = createMockBattlefield('bf1', player1.id);
        battlefield.units = [tankUnit, normalUnit];
        mockGame.battlefields = [battlefield];

        const requirement: TargetRequirement = {
          targetType: TargetType.UNIT,
          count: 1,
          optional: false,
          restrictions: [
            {
              property: TargetProperty.KEYWORD,
              operator: ComparisonOperator.CONTAINS,
              value: 'tank',
            },
          ],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(1);
        expect(validTargets[0]?.id).toBe('tank');
      });
    });

    describe('Card in Hand Targets', () => {
      it('should find cards in player hands', () => {
        // Arrange
        const card1 = createMockCard('card1', 'Card 1', CardType.SPELL, player1.id);
        const card2 = createMockCard('card2', 'Card 2', CardType.SPELL, player2.id);

        player1.zones.hand = [card1];
        player2.zones.hand = [card2];

        const requirement: TargetRequirement = {
          targetType: TargetType.CARD_IN_HAND,
          count: 1,
          optional: false,
          restrictions: [],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(2);
      });

      it('should filter cards by energy cost', () => {
        // Arrange
        const cheapCard = createMockCard('cheap', 'Cheap Card', CardType.SPELL, player1.id);
        cheapCard.energyCost = 1;

        const expensiveCard = createMockCard('expensive', 'Expensive Card', CardType.SPELL, player2.id);
        expensiveCard.energyCost = 5;

        player1.zones.hand = [cheapCard];
        player2.zones.hand = [expensiveCard];

        const requirement: TargetRequirement = {
          targetType: TargetType.CARD_IN_HAND,
          count: 1,
          optional: false,
          restrictions: [
            {
              property: TargetProperty.ENERGY_COST,
              operator: ComparisonOperator.LESS_THAN,
              value: 3,
            },
          ],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(1);
        expect(validTargets[0]?.id).toBe('cheap');
      });
    });

    describe('Player Targets', () => {
      it('should find all players', () => {
        // Arrange
        const requirement: TargetRequirement = {
          targetType: TargetType.PLAYER,
          count: 1,
          optional: false,
          restrictions: [],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(2);
        expect(validTargets[0]?.type).toBe(TargetType.PLAYER);
        expect(validTargets[1]?.type).toBe(TargetType.PLAYER);
      });
    });

    describe('Battlefield Targets', () => {
      it('should find all battlefields', () => {
        // Arrange
        const bf1 = createMockBattlefield('bf1', player1.id);
        const bf2 = createMockBattlefield('bf2', player2.id);
        mockGame.battlefields = [bf1, bf2];

        const requirement: TargetRequirement = {
          targetType: TargetType.BATTLEFIELD,
          count: 1,
          optional: false,
          restrictions: [],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(2);
        expect(validTargets[0]?.type).toBe(TargetType.BATTLEFIELD);
      });
    });

    describe('ChainItem Targets (Counter Spells)', () => {
      it('should find unresolved chain items', () => {
        // Arrange
        const spell1 = createMockCard('spell1', 'Spell 1', CardType.SPELL, player2.id);
        const spell2 = createMockCard('spell2', 'Spell 2', CardType.SPELL, player2.id);

        const chainItem1 = createMockChainItem('chain1', spell1, player2.id, false);
        const chainItem2 = createMockChainItem('chain2', spell2, player2.id, true); // resolved

        mockGame.chain = [chainItem1, chainItem2];

        const requirement: TargetRequirement = {
          targetType: 'chain_item' as TargetType,
          count: 1,
          optional: false,
          restrictions: [],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(1);
        expect(validTargets[0]?.id).toBe('chain1');
      });

      it('should filter chain items by source card energy cost', () => {
        // Arrange
        const cheapSpell = createMockCard('cheap-spell', 'Cheap Spell', CardType.SPELL, player2.id);
        cheapSpell.energyCost = 2;

        const expensiveSpell = createMockCard('expensive-spell', 'Expensive Spell', CardType.SPELL, player2.id);
        expensiveSpell.energyCost = 5;

        const chainItem1 = createMockChainItem('chain1', cheapSpell, player2.id, false);
        const chainItem2 = createMockChainItem('chain2', expensiveSpell, player2.id, false);

        mockGame.chain = [chainItem1, chainItem2];

        const requirement: TargetRequirement = {
          targetType: 'chain_item' as TargetType,
          count: 1,
          optional: false,
          restrictions: [
            {
              property: TargetProperty.ENERGY_COST,
              operator: ComparisonOperator.LESS_THAN,
              value: 5,
            },
          ],
        };

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

        // Assert
        expect(validTargets).toHaveLength(1);
        expect(validTargets[0]?.id).toBe('chain1');
      });
    });

    describe('Multiple Requirements', () => {
      it('should combine targets from multiple requirements', () => {
        // Arrange
        const unit = createMockCard('unit1', 'Unit 1', CardType.UNIT, player1.id);
        const battlefield = createMockBattlefield('bf1', player1.id);
        battlefield.units = [unit];
        mockGame.battlefields = [battlefield];

        const requirements: TargetRequirement[] = [
          {
            targetType: TargetType.UNIT,
            count: 1,
            optional: false,
            restrictions: [],
          },
          {
            targetType: TargetType.PLAYER,
            count: 1,
            optional: false,
            restrictions: [],
          },
        ];

        // Act
        const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, requirements);

        // Assert
        expect(validTargets.length).toBeGreaterThan(2); // At least 1 unit + 2 players
        const unitTargets = validTargets.filter(t => t.type === TargetType.UNIT);
        const playerTargets = validTargets.filter(t => t.type === TargetType.PLAYER);
        expect(unitTargets).toHaveLength(1);
        expect(playerTargets).toHaveLength(2);
      });
    });
  });

  describe('validateTargets', () => {
    it('should accept valid targets', () => {
      // Arrange
      const unit = createMockCard('unit1', 'Unit 1', CardType.UNIT, player1.id);
      const battlefield = createMockBattlefield('bf1', player1.id);
      battlefield.units = [unit];
      mockGame.battlefields = [battlefield];

      const requirement: TargetRequirement = {
        targetType: TargetType.UNIT,
        count: 1,
        optional: false,
        restrictions: [],
      };

      const selectedTargets: Target[] = [
        {
          type: TargetType.UNIT,
          cardId: 'unit1',
          restrictions: [],
        },
      ];

      // Act
      const result = targetingSystem.validateTargets(mockGame, player1.id, [requirement], selectedTargets);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject missing required targets', () => {
      // Arrange
      const requirement: TargetRequirement = {
        targetType: TargetType.UNIT,
        count: 1,
        optional: false,
        restrictions: [],
      };

      const selectedTargets: Target[] = [];

      // Act
      const result = targetingSystem.validateTargets(mockGame, player1.id, [requirement], selectedTargets);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.type).toBe('missing_required');
    });

    it('should accept missing optional targets', () => {
      // Arrange
      const requirement: TargetRequirement = {
        targetType: TargetType.UNIT,
        count: 1,
        optional: true,
        restrictions: [],
      };

      const selectedTargets: Target[] = [];

      // Act
      const result = targetingSystem.validateTargets(mockGame, player1.id, [requirement], selectedTargets);

      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject too many targets', () => {
      // Arrange
      const unit1 = createMockCard('unit1', 'Unit 1', CardType.UNIT, player1.id);
      const unit2 = createMockCard('unit2', 'Unit 2', CardType.UNIT, player1.id);
      const battlefield = createMockBattlefield('bf1', player1.id);
      battlefield.units = [unit1, unit2];
      mockGame.battlefields = [battlefield];

      const requirement: TargetRequirement = {
        targetType: TargetType.UNIT,
        count: 1,
        optional: false,
        restrictions: [],
      };

      const selectedTargets: Target[] = [
        { type: TargetType.UNIT, cardId: 'unit1', restrictions: [] },
        { type: TargetType.UNIT, cardId: 'unit2', restrictions: [] },
      ];

      // Act
      const result = targetingSystem.validateTargets(mockGame, player1.id, [requirement], selectedTargets);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.type).toBe('too_many');
    });

    it('should reject targets that fail restrictions', () => {
      // Arrange
      const furyUnit = createMockCard('fury-unit', 'Fury Unit', CardType.UNIT, player1.id);
      furyUnit.domains = ['Fury' as Domain];

      const battlefield = createMockBattlefield('bf1', player1.id);
      battlefield.units = [furyUnit];
      mockGame.battlefields = [battlefield];

      const requirement: TargetRequirement = {
        targetType: TargetType.UNIT,
        count: 1,
        optional: false,
        restrictions: [
          {
            property: TargetProperty.DOMAIN,
            operator: ComparisonOperator.CONTAINS,
            value: 'Calm', // Looking for Calm, but unit has Fury
          },
        ],
      };

      const selectedTargets: Target[] = [
        { type: TargetType.UNIT, cardId: 'fury-unit', restrictions: [] },
      ];

      // Act
      const result = targetingSystem.validateTargets(mockGame, player1.id, [requirement], selectedTargets);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.type).toBe('restriction_failed');
    });

    it('should reject wrong target type', () => {
      // Arrange
      const requirement: TargetRequirement = {
        targetType: TargetType.UNIT,
        count: 1,
        optional: false,
        restrictions: [],
      };

      const selectedTargets: Target[] = [
        { type: TargetType.PLAYER, playerId: 'player1', restrictions: [] },
      ];

      // Act
      const result = targetingSystem.validateTargets(mockGame, player1.id, [requirement], selectedTargets);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.type).toBe('invalid_type');
    });

    it('should reject non-existent targets', () => {
      // Arrange
      const requirement: TargetRequirement = {
        targetType: TargetType.UNIT,
        count: 1,
        optional: false,
        restrictions: [],
      };

      const selectedTargets: Target[] = [
        { type: TargetType.UNIT, cardId: 'non-existent-unit', restrictions: [] },
      ];

      // Act
      const result = targetingSystem.validateTargets(mockGame, player1.id, [requirement], selectedTargets);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.type).toBe('restriction_failed');
    });
  });

  describe('resolveTargets', () => {
    it('should resolve unit targets to GameCard objects', () => {
      // Arrange
      const unit = createMockCard('unit1', 'Unit 1', CardType.UNIT, player1.id);
      const battlefield = createMockBattlefield('bf1', player1.id);
      battlefield.units = [unit];
      mockGame.battlefields = [battlefield];

      const targets: Target[] = [
        { type: TargetType.UNIT, cardId: 'unit1', restrictions: [] },
      ];

      // Act
      const resolved = targetingSystem.resolveTargets(mockGame, targets);

      // Assert
      expect(resolved).toHaveLength(1);
      expect(resolved[0]?.resolved).toBe(unit);
      expect(resolved[0]?.original.type).toBe('unit');
    });

    it('should resolve player targets to Player objects', () => {
      // Arrange
      const targets: Target[] = [
        { type: TargetType.PLAYER, playerId: 'player1', restrictions: [] },
      ];

      // Act
      const resolved = targetingSystem.resolveTargets(mockGame, targets);

      // Assert
      expect(resolved).toHaveLength(1);
      expect(resolved[0]?.resolved).toBe(player1);
    });

    it('should resolve battlefield targets to Battlefield objects', () => {
      // Arrange
      const battlefield = createMockBattlefield('bf1', player1.id);
      mockGame.battlefields = [battlefield];

      const targets: Target[] = [
        { type: TargetType.BATTLEFIELD, battlefieldId: 'bf1', restrictions: [] },
      ];

      // Act
      const resolved = targetingSystem.resolveTargets(mockGame, targets);

      // Assert
      expect(resolved).toHaveLength(1);
      expect(resolved[0]?.resolved).toBe(battlefield);
    });

    it('should resolve chain item targets to ChainItem objects', () => {
      // Arrange
      const spell = createMockCard('spell1', 'Spell 1', CardType.SPELL, player2.id);
      const chainItem = createMockChainItem('chain1', spell, player2.id, false);
      mockGame.chain = [chainItem];

      const targets: Target[] = [
        { type: 'chain_item' as TargetType, cardId: 'chain1', restrictions: [] },
      ];

      // Act
      const resolved = targetingSystem.resolveTargets(mockGame, targets);

      // Assert
      expect(resolved).toHaveLength(1);
      expect(resolved[0]?.resolved).toBe(chainItem);
    });

    it('should skip non-existent targets', () => {
      // Arrange
      const targets: Target[] = [
        { type: TargetType.UNIT, cardId: 'non-existent', restrictions: [] },
      ];

      // Act
      const resolved = targetingSystem.resolveTargets(mockGame, targets);

      // Assert
      expect(resolved).toHaveLength(0);
    });

    it('should resolve multiple targets', () => {
      // Arrange
      const unit = createMockCard('unit1', 'Unit 1', CardType.UNIT, player1.id);
      const battlefield = createMockBattlefield('bf1', player1.id);
      battlefield.units = [unit];
      mockGame.battlefields = [battlefield];

      const targets: Target[] = [
        { type: TargetType.UNIT, cardId: 'unit1', restrictions: [] },
        { type: TargetType.PLAYER, playerId: 'player1', restrictions: [] },
        { type: TargetType.BATTLEFIELD, battlefieldId: 'bf1', restrictions: [] },
      ];

      // Act
      const resolved = targetingSystem.resolveTargets(mockGame, targets);

      // Assert
      expect(resolved).toHaveLength(3);
      expect(resolved[0]?.resolved).toBe(unit);
      expect(resolved[1]?.resolved).toBe(player1);
      expect(resolved[2]?.resolved).toBe(battlefield);
    });
  });

  describe('Restriction Checking', () => {
    describe('equals operator', () => {
      it('should match exact card type', () => {
        // Arrange
        const spell = createMockCard('spell1', 'Spell', CardType.SPELL, player1.id);
        player1.zones.hand = [spell];

        const restriction: TargetRestriction = {
          property: TargetProperty.CARD_TYPE,
          operator: ComparisonOperator.EQUALS,
          value: 'spell',
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, spell, [restriction]);

        // Assert
        expect(canTarget).toBe(true);
      });

      it('should reject different card type', () => {
        // Arrange
        const unit = createMockCard('unit1', 'Unit', CardType.UNIT, player1.id);

        const restriction: TargetRestriction = {
          property: TargetProperty.CARD_TYPE,
          operator: ComparisonOperator.EQUALS,
          value: 'spell',
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, unit, [restriction]);

        // Assert
        expect(canTarget).toBe(false);
      });
    });

    describe('not_equals operator', () => {
      it('should reject matching value', () => {
        // Arrange
        const spell = createMockCard('spell1', 'Spell', CardType.SPELL, player1.id);

        const restriction: TargetRestriction = {
          property: TargetProperty.CARD_TYPE,
          operator: ComparisonOperator.NOT_EQUALS,
          value: 'spell',
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, spell, [restriction]);

        // Assert
        expect(canTarget).toBe(false);
      });
    });

    describe('greater_than operator', () => {
      it('should accept higher might', () => {
        // Arrange
        const strongUnit = createMockCard('strong', 'Strong Unit', CardType.UNIT, player1.id);
        strongUnit.might = 5;

        const restriction: TargetRestriction = {
          property: TargetProperty.MIGHT,
          operator: ComparisonOperator.GREATER_THAN,
          value: 3,
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, strongUnit, [restriction]);

        // Assert
        expect(canTarget).toBe(true);
      });

      it('should reject equal or lower might', () => {
        // Arrange
        const weakUnit = createMockCard('weak', 'Weak Unit', CardType.UNIT, player1.id);
        weakUnit.might = 2;

        const restriction: TargetRestriction = {
          property: TargetProperty.MIGHT,
          operator: ComparisonOperator.GREATER_THAN,
          value: 3,
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, weakUnit, [restriction]);

        // Assert
        expect(canTarget).toBe(false);
      });
    });

    describe('less_than operator', () => {
      it('should accept lower energy cost', () => {
        // Arrange
        const cheapCard = createMockCard('cheap', 'Cheap Card', CardType.SPELL, player1.id);
        cheapCard.energyCost = 2;

        const restriction: TargetRestriction = {
          property: TargetProperty.ENERGY_COST,
          operator: ComparisonOperator.LESS_THAN,
          value: 5,
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, cheapCard, [restriction]);

        // Assert
        expect(canTarget).toBe(true);
      });
    });

    describe('contains operator', () => {
      it('should match domain in array', () => {
        // Arrange
        const furyUnit = createMockCard('fury-unit', 'Fury Unit', CardType.UNIT, player1.id);
        furyUnit.domains = ['Fury' as Domain, 'Chaos' as Domain];

        const restriction: TargetRestriction = {
          property: TargetProperty.DOMAIN,
          operator: ComparisonOperator.CONTAINS,
          value: 'Fury',
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, furyUnit, [restriction]);

        // Assert
        expect(canTarget).toBe(true);
      });

      it('should match keyword in array', () => {
        // Arrange
        const tankUnit = createMockCard('tank', 'Tank Unit', CardType.UNIT, player1.id);
        tankUnit.keywords = [Keyword.TANK, Keyword.ASSAULT];

        const restriction: TargetRestriction = {
          property: TargetProperty.KEYWORD,
          operator: ComparisonOperator.CONTAINS,
          value: 'tank',
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, tankUnit, [restriction]);

        // Assert
        expect(canTarget).toBe(true);
      });

      it('should match tag in array', () => {
        // Arrange
        const card = createMockCard('card1', 'Card', CardType.SPELL, player1.id);
        card.tags = ['removal', 'instant'];

        const restriction: TargetRestriction = {
          property: TargetProperty.TAG,
          operator: ComparisonOperator.CONTAINS,
          value: 'removal',
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, card, [restriction]);

        // Assert
        expect(canTarget).toBe(true);
      });

      it('should reject missing value in array', () => {
        // Arrange
        const furyUnit = createMockCard('fury-unit', 'Fury Unit', CardType.UNIT, player1.id);
        furyUnit.domains = ['Fury' as Domain];

        const restriction: TargetRestriction = {
          property: TargetProperty.DOMAIN,
          operator: ComparisonOperator.CONTAINS,
          value: 'Calm',
        };

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, furyUnit, [restriction]);

        // Assert
        expect(canTarget).toBe(false);
      });
    });

    describe('Multiple restrictions', () => {
      it('should require all restrictions to pass', () => {
        // Arrange
        const unit = createMockCard('unit1', 'Unit 1', CardType.UNIT, player1.id);
        unit.domains = ['Fury' as Domain];
        unit.might = 5;
        unit.energyCost = 3;

        const restrictions: TargetRestriction[] = [
          {
            property: TargetProperty.DOMAIN,
            operator: ComparisonOperator.CONTAINS,
            value: 'Fury',
          },
          {
            property: TargetProperty.MIGHT,
            operator: ComparisonOperator.GREATER_THAN,
            value: 3,
          },
          {
            property: TargetProperty.ENERGY_COST,
            operator: ComparisonOperator.LESS_THAN,
            value: 5,
          },
        ];

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, unit, restrictions);

        // Assert
        expect(canTarget).toBe(true);
      });

      it('should fail if any restriction fails', () => {
        // Arrange
        const unit = createMockCard('unit1', 'Unit 1', CardType.UNIT, player1.id);
        unit.domains = ['Fury' as Domain];
        unit.might = 2; // Fails might check
        unit.energyCost = 3;

        const restrictions: TargetRestriction[] = [
          {
            property: TargetProperty.DOMAIN,
            operator: ComparisonOperator.CONTAINS,
            value: 'Fury',
          },
          {
            property: TargetProperty.MIGHT,
            operator: ComparisonOperator.GREATER_THAN,
            value: 3,
          },
        ];

        // Act
        const canTarget = targetingSystem.canTargetCard(mockGame, unit, restrictions);

        // Assert
        expect(canTarget).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty requirements array', () => {
      // Arrange
      const requirements: TargetRequirement[] = [];

      // Act
      const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, requirements);

      // Assert
      expect(validTargets).toHaveLength(0);
    });

    it('should handle empty game state', () => {
      // Arrange
      mockGame.battlefields = [];
      mockGame.chain = [];
      player1.zones.hand = [];
      player2.zones.hand = [];

      const requirement: TargetRequirement = {
        targetType: TargetType.UNIT,
        count: 1,
        optional: false,
        restrictions: [],
      };

      // Act
      const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

      // Assert
      expect(validTargets).toHaveLength(0);
    });

    it('should handle cards in multiple zones', () => {
      // Arrange
      const handCard = createMockCard('hand1', 'Hand Card', CardType.SPELL, player1.id);
      handCard.zone = 'hand';
      player1.zones.hand = [handCard];

      const trashCard = createMockCard('trash1', 'Trash Card', CardType.SPELL, player1.id);
      trashCard.zone = 'trash';
      player1.zones.trash = [trashCard];

      const requirement: TargetRequirement = {
        targetType: TargetType.CARD_IN_TRASH,
        count: 1,
        optional: false,
        restrictions: [],
      };

      // Act
      const validTargets = targetingSystem.getValidTargets(mockGame, player1.id, [requirement]);

      // Assert
      expect(validTargets).toHaveLength(1);
      expect(validTargets[0]?.id).toBe('trash1');
    });
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createMockPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    score: 0,
    championLegend: null as any,
    zones: {
      hand: [],
      mainDeck: [],
      runeDeck: [],
      championZone: [],
      trash: [],
      banishment: [],
      base: [],
      runes: [],
    },
    runePool: {
      energy: 0,
      power: [],
    },
    hasPlayedCard: false,
    turnsPassed: 0,
  };
}

function createMockCard(
  instanceId: string,
  name: string,
  cardType: CardType,
  ownerId: string
): GameCard {
  return {
    instanceId,
    cardId: `card-${instanceId}`,
    id: `card-${instanceId}`,
    name,
    description: `Description for ${name}`,
    cardType,
    rarity: 'common' as any,
    energyCost: 0,
    powerCost: [],
    ownerId,
    controllerId: ownerId,
    zone: 'hand',
    ready: true,
    domains: [],
    keywords: [],
    tags: [],
    damage: 0,
    temporaryModifiers: [],
    counters: [],
  };
}

function createMockBattlefield(id: string, controller: string): Battlefield {
  const battlefieldCard: BattlefieldCard = {
    id: `bf-card-${id}`,
    name: `Battlefield ${id}`,
    energyCost: 0,
    powerCost: [],
    description: `Battlefield card for ${id}`,
    cardType: CardType.BATTLEFIELD,
    rarity: 'common' as any,
    domains: [],
    keywords: [],
    tags: [],
    battlefieldAbilities: [],
    scoreValue: 1,
  };

  return {
    id,
    card: battlefieldCard,
    controller,
    units: [],
    sides: {},
    contested: false,
    facedownCards: [],
  };
}

function createMockChainItem(
  id: string,
  sourceCard: GameCard,
  controllerId: string,
  resolved: boolean
): ChainItem {
  return {
    id,
    type: 'spell' as ChainItemType,
    sourceCardId: sourceCard.instanceId,
    sourceCard,
    controllerId,
    resolved,
    targets: [],
    effects: [],
    timestamp: new Date(),
  };
}
