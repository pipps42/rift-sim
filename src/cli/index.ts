/**
 * CLI Entry Point
 *
 * Usage:
 *   npm run play
 *   node dist/cli/index.js
 */

import { GameCLI } from './GameCLI';

async function main() {
  try {
    const cli = new GameCLI();
    await cli.start();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
