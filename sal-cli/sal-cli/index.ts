#!/usr/bin/env tsx

import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from sal-cli/.env
config({ path: path.resolve(__dirname, './.env') });

import { askSal, syncMemory, fixCode, buildApp, deployApp } from './lib/actions';

const [,, command, ...args] = process.argv;

(async () => {
  if (command === 'ask') await askSal(args.join(' ') || "What's the mission?");
  if (command === 'sync:memory') await syncMemory();
  if (command === 'fix') await fixCode();
  if (command === 'build') await buildApp();
  if (command === 'deploy') await deployApp();
})();
