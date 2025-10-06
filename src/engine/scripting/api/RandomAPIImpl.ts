/**
 * Random API Implementation
 *
 * Provides card scripts with deterministic random number generation.
 * Uses seeded RNG for replay consistency.
 */

import type { RandomAPI } from '../types/CardScriptTypes';
import type { Game } from '../../../types/game';

/**
 * Implementation of RandomAPI with seeded RNG.
 */
export class RandomAPIImpl implements RandomAPI {
  private game: Game;
  private seed: number;

  constructor(game: Game, seed?: number) {
    this.game = game;
    this.seed = seed || this.generateSeedFromGame();
  }

  /**
   * Random integer in range [min, max).
   */
  int(min: number, max: number): number {
    const value = this.nextFloat();
    return Math.floor(value * (max - min)) + min;
  }

  /**
   * Random float in range [0, 1).
   */
  float(): number {
    return this.nextFloat();
  }

  /**
   * Pick random element from array.
   */
  pick<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    const index = this.int(0, array.length);
    const element = array[index];
    if (element === undefined) {
      throw new Error('Array element is undefined');
    }
    return element;
  }

  /**
   * Shuffle array (returns new array).
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.int(0, i + 1);
      const temp = shuffled[i];
      const swap = shuffled[j];
      if (temp !== undefined && swap !== undefined) {
        shuffled[i] = swap;
        shuffled[j] = temp;
      }
    }
    return shuffled;
  }

  /**
   * Random boolean with given probability (0-1).
   */
  chance(probability: number): boolean {
    if (probability < 0 || probability > 1) {
      throw new Error('Probability must be between 0 and 1');
    }
    return this.nextFloat() < probability;
  }

  /**
   * Generate next random float using seeded RNG.
   * Uses simple LCG (Linear Congruential Generator) algorithm.
   */
  private nextFloat(): number {
    // LCG parameters (same as Java's Random)
    const a = 1103515245;
    const c = 12345;
    const m = 2 ** 31;

    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  /**
   * Generate seed from game state for deterministic replay.
   */
  private generateSeedFromGame(): number {
    // Combine game ID, round, and timestamp
    const gameIdHash = this.hashString(this.game.id);
    const round = this.game.round;
    const timestamp = this.game.createdAt.getTime();

    return (gameIdHash + round + timestamp) % (2 ** 31);
  }

  /**
   * Simple string hash function.
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get current seed (for debugging/testing).
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Reset seed.
   */
  resetSeed(newSeed: number): void {
    this.seed = newSeed;
  }
}
