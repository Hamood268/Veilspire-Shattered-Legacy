const AdventureGame = require('./src/game');
const game = new AdventureGame();

const MIN_NODE_VERSION = 18;

try {
  // Node version check
  const [major] = process.version.slice(1).split('.').map(Number);
  if (major < MIN_NODE_VERSION) {
    console.error(`Error: Node.js v${MIN_NODE_VERSION}+ required. Download: https://nodejs.org`);
    process.exit(1);
  }

  // Start game
  game.start();

} catch (error) {
  console.error('⚠️  Critical Error:', error.message);
}

