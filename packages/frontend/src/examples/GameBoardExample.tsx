import { GameBoard, GameBoardProps } from '../components/composite/GameBoard';
import type { GamePhase } from '../components/game/PhaseIndicator';

/**
 * Example GameBoard with mock data for testing and development
 */
export function GameBoardExample() {
  const mockGameBoardData: GameBoardProps = {
    // Current Player (bottom)
    player: {
      player: {
        name: 'Player 1',
        score: 4,
        avatarUrl: 'https://via.placeholder.com/64',
        hasPriority: true,
      },
      handCards: [
        {
          instanceId: 'card-1',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Ahri, Nine-Tailed Fox',
          isPlayable: true,
          isRevealed: true,
        },
        {
          instanceId: 'card-2',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Yasuo, The Unforgiven',
          isPlayable: false,
          isRevealed: true,
        },
        {
          instanceId: 'card-3',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Lux, Lady of Luminosity',
          isPlayable: true,
          isRevealed: true,
        },
      ],
      mainDeckCount: 32,
      runeDeckCount: 8,
      runes: [
        {
          id: 'rune-1',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Fury Rune',
          domain: 'FURY',
          ready: true,
        },
        {
          id: 'rune-2',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Calm Rune',
          domain: 'CALM',
          ready: false,
        },
        {
          id: 'rune-3',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Mind Rune',
          domain: 'MIND',
          ready: true,
        },
      ],
      runePool: {
        energy: 5,
        powerCosts: [
          { domain: 'FURY', amount: 2 },
          { domain: 'CALM', amount: 1 },
          { domain: 'MIND', amount: 3 },
        ],
      },
      gears: [
        {
          id: 'gear-1',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Infinity Edge',
        },
      ],
      trashCards: [
        {
          id: 'trash-1',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Last Discarded Card',
        },
      ],
      baseUnits: [
        {
          id: 'unit-1',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Teemo',
          damage: 0,
          ready: true,
        },
        {
          id: 'unit-2',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Braum',
          damage: 2,
          ready: false,
        },
      ],
      legend: {
        id: 'legend-1',
        imageUrl: 'https://via.placeholder.com/240x336',
        name: 'Demacia',
      },
      chosenChampion: {
        id: 'champion-1',
        imageUrl: 'https://via.placeholder.com/240x336',
        name: 'Garen',
        isRevealed: true,
      },
    },

    // Opponent (top)
    opponent: {
      player: {
        name: 'Opponent',
        score: 3,
        avatarUrl: 'https://via.placeholder.com/64',
        hasPriority: false,
      },
      handCards: [
        { instanceId: 'opp-1', imageUrl: '', name: '', isRevealed: false },
        { instanceId: 'opp-2', imageUrl: '', name: '', isRevealed: false },
        { instanceId: 'opp-3', imageUrl: '', name: '', isRevealed: false },
        { instanceId: 'opp-4', imageUrl: '', name: '', isRevealed: false },
        { instanceId: 'opp-5', imageUrl: '', name: '', isRevealed: false },
      ],
      mainDeckCount: 28,
      runeDeckCount: 6,
      runes: [
        {
          id: 'opp-rune-1',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Body Rune',
          domain: 'BODY',
          ready: true,
        },
        {
          id: 'opp-rune-2',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Chaos Rune',
          domain: 'CHAOS',
          ready: false,
        },
      ],
      runePool: {
        energy: 4,
        powerCosts: [
          { domain: 'BODY', amount: 2 },
          { domain: 'CHAOS', amount: 1 },
        ],
      },
      gears: [],
      trashCards: [
        {
          id: 'opp-trash-1',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Opponent Trash',
        },
      ],
      baseUnits: [
        {
          id: 'opp-unit-1',
          imageUrl: 'https://via.placeholder.com/240x336',
          name: 'Darius',
          damage: 1,
          ready: true,
        },
      ],
      legend: {
        id: 'opp-legend-1',
        imageUrl: 'https://via.placeholder.com/240x336',
        name: 'Noxus',
      },
      chosenChampion: {
        id: 'opp-champion-1',
        imageUrl: 'https://via.placeholder.com/240x336',
        name: 'Katarina',
        isRevealed: true,
      },
    },

    // Battlefield Center
    battlefieldCenter: {
      battlefields: [
        {
          battlefield: {
            imageUrl: 'https://via.placeholder.com/384x224',
            name: 'Summoner\'s Rift - Top Lane',
            isContested: true,
          },
          playerUnits: [
            {
              id: 'bf1-p-unit-1',
              imageUrl: 'https://via.placeholder.com/240x336',
              name: 'Fiora',
              damage: 0,
              ready: true,
              originalMight: 4,
              modifiedMight: 5,
            },
          ],
          opponentUnits: [
            {
              id: 'bf1-o-unit-1',
              imageUrl: 'https://via.placeholder.com/240x336',
              name: 'Sett',
              damage: 3,
              ready: false,
              originalMight: 6,
            },
          ],
        },
        {
          battlefield: {
            imageUrl: 'https://via.placeholder.com/384x224',
            name: 'Summoner\'s Rift - Bot Lane',
            isContested: false,
          },
          playerUnits: [
            {
              id: 'bf2-p-unit-1',
              imageUrl: 'https://via.placeholder.com/240x336',
              name: 'Jinx',
              damage: 0,
              ready: true,
              originalMight: 3,
            },
            {
              id: 'bf2-p-unit-2',
              imageUrl: 'https://via.placeholder.com/240x336',
              name: 'Lulu',
              damage: 0,
              ready: true,
              originalMight: 2,
            },
          ],
          opponentUnits: [],
        },
      ],
      gameInfo: {
        player1: {
          name: 'Player 1',
          score: 4,
        },
        player2: {
          name: 'Opponent',
          score: 3,
        },
        currentPhase: 'ACTION' as GamePhase,
        turnNumber: 5,
        roundNumber: 3,
        priorityPlayer: 'Player 1',
      },
      chainItems: [
        {
          id: 'chain-1',
          cardImageUrl: 'https://via.placeholder.com/80x112',
          cardName: 'Lightning Bolt',
          type: 'spell',
          controller: 'Player 1',
        },
        {
          id: 'chain-2',
          cardImageUrl: 'https://via.placeholder.com/80x112',
          cardName: 'Counter Spell',
          type: 'ability',
          controller: 'Opponent',
        },
      ],
    },
  };

  return <GameBoard {...mockGameBoardData} />;
}
