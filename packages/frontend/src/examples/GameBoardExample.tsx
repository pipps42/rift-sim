import { GameBoard } from '../components/composite/GameBoard';
import type { GameBoardProps } from '../components/composite/GameBoard';
import type { GamePhase } from '../components/game/PhaseIndicator';
import { Domain } from '@riftbound/shared';

/**
 * Example GameBoard with mock data for testing and development
 */
export function GameBoardExample({ showBackButton = false, onBack }: { showBackButton?: boolean; onBack?: () => void } = {}) {
  const mockGameBoardData: GameBoardProps = {
    // Current Player (bottom)
    player: {
      player: {
        name: 'Player 1',
        score: 4,
        avatarUrl: 'https://placehold.co/64',
        hasPriority: true,
      },
      handCards: [
        {
          instanceId: 'card-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Ahri, Nine-Tailed Fox',
          isPlayable: true,
        },
        {
          instanceId: 'card-2',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Yasuo, The Unforgiven',
          isPlayable: false,
        },
        {
          instanceId: 'card-3',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Lux, Lady of Luminosity',
          isPlayable: true,
        },
        {
          instanceId: 'card-4',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Ezreal, Prodigal Explorer',
          isPlayable: true,
        },
        {
          instanceId: 'card-5',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Miss Fortune, Bounty Hunter',
          isPlayable: false,
        },
        {
          instanceId: 'card-6',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Thresh, Chain Warden',
          isPlayable: true,
        },
        {
          instanceId: 'card-7',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Zed, Master of Shadows',
          isPlayable: false,
        },
      ],
      mainDeckCount: 32,
      runeDeckCount: 8,
      runes: [
        {
          instanceId: 'rune-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Fury Rune',
          domain: Domain.FURY,
          ready: true,
        },
        {
          instanceId: 'rune-2',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Calm Rune',
          domain: Domain.CALM,
          ready: false,
        },
        {
          instanceId: 'rune-3',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Mind Rune',
          domain: Domain.MIND,
          ready: true,
        },
      ],
      runePool: {
        energy: 5,
        powerCosts: [
          { domain: Domain.FURY, amount: 2 },
          { domain: Domain.CALM, amount: 1 },
          { domain: Domain.MIND, amount: 3 },
        ],
      },
      gears: [
        {
          instanceId: 'gear-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Infinity Edge',
        },
        {
          instanceId: 'gear-2',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Rabadon\'s Deathcap',
        },
        {
          instanceId: 'gear-3',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Guardian Angel',
        },
      ],
      trashCards: [
        {
          instanceId: 'trash-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Last Discarded Card',
        },
      ],
      baseUnits: [
        {
          instanceId: 'unit-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Teemo',
          damage: 0,
          ready: true,
        },
        {
          instanceId: 'unit-2',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Braum',
          damage: 2,
          ready: false,
        },
        {
          instanceId: 'unit-3',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Poppy',
          damage: 0,
          ready: true,
        },
        {
          instanceId: 'unit-4',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Leona',
          damage: 1,
          ready: true,
        },
      ],
      legend: {
        instanceId: 'legend-1',
        imageUrl: 'https://placehold.co/240x336',
        name: 'Demacia',
      },
      chosenChampion: {
        instanceId: 'champion-1',
        imageUrl: 'https://placehold.co/240x336',
        name: 'Garen',
      },
    },

    // Opponent (top)
    opponent: {
      player: {
        name: 'Opponent',
        score: 3,
        avatarUrl: 'https://placehold.co/64',
        hasPriority: false,
      },
      handCards: [
        { instanceId: 'opp-1', imageUrl: '', name: '' },
        { instanceId: 'opp-2', imageUrl: '', name: '' },
        { instanceId: 'opp-3', imageUrl: '', name: '' },
        { instanceId: 'opp-4', imageUrl: '', name: '' },
        { instanceId: 'opp-5', imageUrl: '', name: '' },
        { instanceId: 'opp-6', imageUrl: '', name: '' },
        { instanceId: 'opp-7', imageUrl: '', name: '' },
        { instanceId: 'opp-8', imageUrl: '', name: '' },
      ],
      mainDeckCount: 28,
      runeDeckCount: 6,
      runes: [
        {
          instanceId: 'opp-rune-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Body Rune',
          domain: Domain.BODY,
          ready: true,
        },
        {
          instanceId: 'opp-rune-2',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Chaos Rune',
          domain: Domain.CHAOS,
          ready: false,
        },
      ],
      runePool: {
        energy: 4,
        powerCosts: [
          { domain: Domain.BODY, amount: 2 },
          { domain: Domain.CHAOS, amount: 1 },
        ],
      },
      gears: [
        {
          instanceId: 'opp-gear-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Black Cleaver',
        },
        {
          instanceId: 'opp-gear-2',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Thornmail',
        },
      ],
      trashCards: [
        {
          instanceId: 'opp-trash-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Opponent Trash',
        },
      ],
      baseUnits: [
        {
          instanceId: 'opp-unit-1',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Darius',
          damage: 1,
          ready: true,
        },
        {
          instanceId: 'opp-unit-2',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Draven',
          damage: 0,
          ready: false,
        },
        {
          instanceId: 'opp-unit-3',
          imageUrl: 'https://placehold.co/240x336',
          name: 'Swain',
          damage: 3,
          ready: true,
        },
      ],
      legend: {
        instanceId: 'opp-legend-1',
        imageUrl: 'https://placehold.co/240x336',
        name: 'Noxus',
      },
      chosenChampion: {
        instanceId: 'opp-champion-1',
        imageUrl: 'https://placehold.co/240x336',
        name: 'Katarina',
      },
    },

    // Battlefield Center
    battlefieldCenter: {
      battlefields: [
        {
          id: 'battlefield-1',
          imageUrl: 'https://placehold.co/384x224',
          name: 'Summoner\'s Rift - Top Lane',
          isContested: true,
          playerUnits: [
            {
              instanceId: 'bf1-p-unit-1',
              imageUrl: 'https://placehold.co/240x336',
              name: 'Fiora',
              damage: 0,
              ready: true,
              originalMight: 4,
              modifiedMight: 5,
            },
          ],
          opponentUnits: [
            {
              instanceId: 'bf1-o-unit-1',
              imageUrl: 'https://placehold.co/240x336',
              name: 'Sett',
              damage: 3,
              ready: false,
              originalMight: 6,
            },
          ],
        },
        {
          id: 'battlefield-2',
          imageUrl: 'https://placehold.co/384x224',
          name: 'Summoner\'s Rift - Bot Lane',
          isContested: false,
          playerUnits: [
            {
              instanceId: 'bf2-p-unit-1',
              imageUrl: 'https://placehold.co/240x336',
              name: 'Jinx',
              damage: 0,
              ready: true,
              originalMight: 3,
            },
            {
              instanceId: 'bf2-p-unit-2',
              imageUrl: 'https://placehold.co/240x336',
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
          cardImageUrl: 'https://placehold.co/80x112',
          cardName: 'Lightning Bolt',
          type: 'spell',
          controller: 'Player 1',
        },
        {
          id: 'chain-2',
          cardImageUrl: 'https://placehold.co/80x112',
          cardName: 'Counter Spell',
          type: 'ability',
          controller: 'Opponent',
        },
      ],
    },
  };

  return (
    <>
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: 1000,
            padding: '8px 16px',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          ← Back to Menu
        </button>
      )}
      <GameBoard {...mockGameBoardData} cardWidth={100} />
    </>
  );
}
