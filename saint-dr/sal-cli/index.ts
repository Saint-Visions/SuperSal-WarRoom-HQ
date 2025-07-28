#!/usr/bin/env tsx

import 'dotenv/config'
import { askAgent, syncMemory, viewLogs } from './lib/actions'
import { program } from 'commander'

program
  .name('sal')
  .description('Saint~Dr.™ Terminal Agent CLI — Protect the vision, execute ruthlessly.')

program
  .command('ask')
  .argument('<question>', 'Ask Saint~Dr.™ anything')
  .action(async (question) => await askAgent(question))

program
  .command('exec')
  .argument('<command>', 'Execute internal ops command')
  .action(async (cmd) => {
    if (cmd === 'sync:memory') await syncMemory()
    else console.log('❌ Unknown command.')
  })

program
  .command('logs:view')
  .description('View session memory logs')
  .action(() => viewLogs())

program.parse()
