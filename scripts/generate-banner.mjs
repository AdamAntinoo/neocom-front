import figlet from 'figlet';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version ?? '0.0.0';

const title = figlet.textSync('Neocom', { horizontalLayout: 'default' });
const banner = `${title}\nv${version}\n`;

const outPath = path.join(root, 'banner.txt');
writeFileSync(outPath, banner, 'utf8');
console.log(`Wrote ${outPath}`);
