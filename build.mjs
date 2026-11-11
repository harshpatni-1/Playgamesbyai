import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
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
const home = await readFile(join(out, 'index.html'), 'utf8');
for (const file of requiredGames) {
  if (!home.includes(`games/${file}`)) throw new Error(`Homepage link missing for ${file}`);
  if (!existsSync(join(out, 'games', file))) throw new Error(`Build did not include ${file}`);
}
const outputs = [
  join(out, 'index.html'),
  ...readdirSync(join(out, 'games'))
    .filter(file => file.endsWith('.html'))
    .map(file => join(out, 'games', file))
];
if (existsSync(join(out, '404.html'))) outputs.push(join(out, '404.html'));
for (const file of outputs) {
  const html = await readFile(file, 'utf8');
  const bootstrapCount = (html.match(/window\.va\s*=\s*window\.va\s*\|\|\s*function\b/g) ?? []).length;
  const scriptMatches = html.match(/<script\b(?=[^>]*\bdefer\b)(?=[^>]*\bsrc=["']\/_vercel\/insights\/script\.js["'])[^>]*>\s*<\/script>/gi) ?? [];
  const bootstrapPosition = html.indexOf('window.va = window.va || function');
  const scriptPosition = html.indexOf('/_vercel/insights/script.js');
  if (bootstrapCount !== 1 || scriptMatches.length !== 1 || bootstrapPosition === -1 || bootstrapPosition > scriptPosition) {
    throw new Error(`Expected one Vercel Web Analytics bootstrap followed by one deferred script in ${file}`);
  }
}
console.log(`Build complete: ${outputs.length} HTML files copied to ${resolve(out)}.`);
