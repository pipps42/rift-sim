/**
 * HistoryQueryAPI Tests
 *
 * Tests the history query helper API for common patterns.
 */

import { HistoryQueryAPI } from '../HistoryQueryAPI';
import type { Game, GameEvent, EventType, Player } from '../../../types/game';

describe('HistoryQueryAPI', () => {
  let mockGame: Game;
  let historyQuery: HistoryQueryAPI;
  let mockHistory: GameEvent[];

  beforeEach(() => {
    mockHistory = [];

    const mockPlayer: Player = {
      id: 'player1',
      name: 'Test Player',
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
        energy: 5,
        power: [],
      },
      hasPlayedCard: false,
      turnsPassed: 0,
    };

    mockGame = {
      id: 'test-game',
      players: [mockPlayer, { ...mockPlayer, id: 'player2' }] as [Player, Player],
      currentPlayerIndex: 0,
      phase: 'action' as any,
      turnState: 'neutral_open' as any,
      round: 3,
      status: 'in_progress' as any,
      battlefields: [],
      chain: [],
      storage: null as any,
      history: mockHistory,
      historyQuery: null as any, // Will be set below
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    historyQuery = new HistoryQueryAPI(mockGame);
    mockGame.historyQuery = historyQuery;
  });

  describe('Spell Queries', () => {
    beforeEach(() => {
      // Add spell cast events
      mockHistory.push(
        createEvent('SPELL_CAST', 'player1', { turn: 3 }),
        createEvent('SPELL_CAST', 'player1', { turn: 3 }),
        createEvent('SPELL_CAST', 'player2', { turn: 3 }),
        createEvent('SPELL_CAST', 'player1', { turn: 2 }), // Previous turn
      );
    });

    it('should count spells cast this turn by player', () => {
      const count = historyQuery.getSpellsCastThisTurn('player1');
      expect(count).toBe(2); // 2 spells by player1 in turn 3
    });

    it('should count spells cast this game by player', () => {
      const count = historyQuery.getSpellsCastThisGame('player1');
      expect(count).toBe(3); // All spells by player1
    });

    it('should get spell cast events this turn', () => {
      const events = historyQuery.getSpellsCastThisTurnEvents('player1');
      expect(events).toHaveLength(2);
      expect(events.every(e => e.playerId === 'player1')).toBe(true);
    });
  });

  describe('Unit Queries', () => {
    beforeEach(() => {
      mockHistory.push(
        createEvent('UNIT_PLAYED', 'player1', { turn: 3 }),
        createEvent('UNIT_PLAYED', 'player1', { turn: 3 }),
        createEvent('UNIT_PLAYED', 'player2', { turn: 3 }),
        createEvent('UNIT_DEATH', 'player1', { turn: 3 }),
      );
    });

    it('should count units played this turn', () => {
      const count = historyQuery.getUnitsPlayedThisTurn('player1');
      expect(count).toBe(2);
    });

    it('should count units played this game', () => {
      const count = historyQuery.getUnitsPlayedThisGame('player1');
      expect(count).toBe(2);
    });

    it('should count unit deaths this turn', () => {
      const count = historyQuery.getUnitsDeathsThisTurn();
      expect(count).toBe(1);
    });

    it('should filter unit deaths by player', () => {
      const count = historyQuery.getUnitsDeathsThisTurn('player1');
      expect(count).toBe(1);
    });
  });

  describe('Damage Queries', () => {
    beforeEach(() => {
      mockHistory.push(
        createEvent('DAMAGE', 'player1', {
          turn: 3,
          sourceId: 'card-1',
          targetId: 'enemy-1',
          amount: 3
        }),
        createEvent('DAMAGE', 'player1', {
          turn: 3,
          sourceId: 'card-1',
          targetId: 'enemy-2',
          amount: 2
        }),
        createEvent('DAMAGE', 'player2', {
          turn: 3,
          sourceId: 'card-2',
          targetId: 'card-1',
          amount: 4
        }),
      );
    });

    it('should calculate total damage dealt by card', () => {
      const damage = historyQuery.getDamageDealtByCard('card-1');
      expect(damage).toBe(5); // 3 + 2
    });

    it('should calculate total damage taken by card', () => {
      const damage = historyQuery.getDamageTakenByCard('card-1');
      expect(damage).toBe(4);
    });

    it('should calculate total damage dealt by player', () => {
      const damage = historyQuery.getTotalDamageDealtThisTurn('player1');
      expect(damage).toBe(5); // 3 + 2
    });
  });

  describe('Card Draw Queries', () => {
    beforeEach(() => {
      mockHistory.push(
        createEvent('CARD_DRAW', 'player1', { turn: 3 }),
        createEvent('CARD_DRAW', 'player1', { turn: 3 }),
        createEvent('CARD_DRAW', 'player1', { turn: 2 }),
      );
    });

    it('should count cards drawn this turn', () => {
      const count = historyQuery.getCardsDrawnThisTurn('player1');
      expect(count).toBe(2);
    });

    it('should count cards drawn this game', () => {
      const count = historyQuery.getCardsDrawnThisGame('player1');
      expect(count).toBe(3);
    });
  });

  describe('Attack Queries', () => {
    beforeEach(() => {
      mockHistory.push(
        createEvent('ATTACK', 'player1', { turn: 3 }, 'card-1'),
        createEvent('ATTACK', 'player1', { turn: 3 }, 'card-2'),
        createEvent('ATTACK', 'player1', { turn: 3 }, 'card-1'), // card-1 attacks again
      );
    });

    it('should count attacks this turn', () => {
      const count = historyQuery.getAttacksThisTurn('player1');
      expect(count).toBe(3);
    });

    it('should count attacks by specific card', () => {
      const count = historyQuery.getCardAttackCount('card-1');
      expect(count).toBe(2);
    });
  });

  describe('General Queries', () => {
    beforeEach(() => {
      mockHistory.push(
        createEvent('SPELL_CAST', 'player1', { turn: 3 }),
        createEvent('SPELL_CAST', 'player1', { turn: 3 }),
        createEvent('UNIT_PLAYED', 'player1', { turn: 3 }),
        createEvent('DAMAGE', 'player1', { turn: 3, amount: 5 }),
      );
    });

    it('should get last N events of type', () => {
      const events = historyQuery.getLastEvents('SPELL_CAST' as EventType, 1);
      expect(events).toHaveLength(1);
      if (events.length > 0) {
        expect(events[0]!.type).toBe('SPELL_CAST');
      }
    });

    it('should get last event of type', () => {
      const event = historyQuery.getLastEvent('SPELL_CAST' as EventType);
      expect(event).toBeDefined();
      if (event) {
        expect(event.type).toBe('SPELL_CAST');
      }
    });

    it('should check if event occurred this turn', () => {
      const occurred = historyQuery.didEventOccurThisTurn(
        e => e.type === ('DAMAGE' as EventType)
      );
      expect(occurred).toBe(true);
    });

    it('should count events matching predicate', () => {
      const count = historyQuery.countEventsThisTurn(
        e => e.playerId === 'player1'
      );
      expect(count).toBe(4);
    });

    it('should get events this turn', () => {
      const events = historyQuery.getEventsThisTurn();
      expect(events).toHaveLength(4);
    });

    it('should get events by type this turn', () => {
      const events = historyQuery.getEventsByTypeThisTurn('SPELL_CAST' as EventType);
      expect(events).toHaveLength(2);
    });

    it('should get events by player this turn', () => {
      const events = historyQuery.getEventsByPlayerThisTurn('player1');
      expect(events).toHaveLength(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty history', () => {
      expect(historyQuery.getSpellsCastThisTurn('player1')).toBe(0);
      expect(historyQuery.getUnitsPlayedThisTurn('player1')).toBe(0);
      expect(historyQuery.getEventsThisTurn()).toHaveLength(0);
    });

    it('should handle no matches', () => {
      mockHistory.push(
        createEvent('SPELL_CAST', 'player2', { turn: 3 })
      );

      expect(historyQuery.getSpellsCastThisTurn('player1')).toBe(0);
    });

    it('should get current turn', () => {
      expect(historyQuery.getCurrentTurn()).toBe(3);
    });

    it('should get read-only history', () => {
      mockHistory.push(createEvent('SPELL_CAST', 'player1', { turn: 3 }));

      const history = historyQuery.getHistory();
      expect(history).toHaveLength(1);
    });
  });

  describe('Performance', () => {
    it('should handle large history efficiently', () => {
      // Add 1000 events
      for (let i = 0; i < 1000; i++) {
        mockHistory.push(
          createEvent('SPELL_CAST', i % 2 === 0 ? 'player1' : 'player2', { turn: 3 })
        );
      }

      const start = Date.now();

      const count = historyQuery.getSpellsCastThisTurn('player1');

      const duration = Date.now() - start;

      expect(count).toBe(500);
      expect(duration).toBeLessThan(10); // Should be very fast
    });
  });
});

// Helper function to create mock events
function createEvent(
  type: string,
  playerId: string,
  data: any = {},
  cardId?: string
): GameEvent {
  return {
    id: `event-${Math.random()}`,
    gameId: 'test-game',
    type: type as EventType,
    playerId,
    ...(cardId && { cardId }),
    timestamp: new Date(),
    data,
  };
}
