#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Auto-loads .env in the current dir

import { askSal, syncMemory, fixCode, buildApp, deployApp } from './lib/actions';

const [, , command, ...args] = process.argv;

(async () => {
  switch (command) {
    case 'ask':
      await askSal(args.join(' ') || "What's the mission?");
      break;
    case 'sync:memory':
      await syncMemory();
      break;
    case 'fix':
      await fixCode();
      break;
    case 'build':
      await buildApp();
      break;
    case 'deploy':
      await deployApp();
      break;
    default:
      console.log('❓ Unknown command. Try: ask, sync:memory, fix, build, deploy');
  }
})();
