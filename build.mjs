import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const out = join(root, 'dist');
const requiredGames = [
  'grok-neon-pulse.html',
  'chatgpt-pulse-rift.html',
  'claude-neon-pulse.html',
  'gemini-cyber-pulse.html'
];

if (!existsSync(join(root, 'index.html'))) throw new Error('Missing root index.html. Deploy from the project root.');
if (!existsSync(join(root, 'games')) || !statSync(join(root, 'games')).isDirectory()) {
  throw new Error('Missing games/ directory. Extract the complete ZIP; do not upload only index.html.');
}
for (const file of requiredGames) {
  if (!existsSync(join(root, 'games', file))) throw new Error(`Missing game page: games/${file}`);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'index.html'), join(out, 'index.html'));
cpSync(join(root, 'games'), join(out, 'games'), { recursive: true });
if (existsSync(join(root, '404.html'))) cpSync(join(root, '404.html'), join(out, '404.html'));

// Validate every local game URL in the homepage points to a file copied into dist.
const home = await (await import('node:fs/promises')).readFile(join(out, 'index.html'), 'utf8');
for (const file of requiredGames) {
  if (!home.includes(`games/${file}`)) throw new Error(`Homepage link missing for ${file}`);
  if (!existsSync(join(out, 'games', file))) throw new Error(`Build did not include ${file}`);
}
const outputs = [join(out, 'index.html'), ...readdirSync(join(out, 'games')).map(f => join(out, 'games', f))];
console.log(`Build complete: ${outputs.length} HTML files copied to ${resolve(out)}.`);
