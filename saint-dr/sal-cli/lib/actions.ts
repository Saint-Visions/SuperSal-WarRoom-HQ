import { OpenAI } from 'openai';
import fs from 'fs-extra';
import chalk from 'chalk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askAgent(prompt: string) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are Saint~Dr.™, the ruthless execution agent. Always ready. Always sharp.' },
      { role: 'user', content: prompt }
    ]
  });

  const output = res.choices[0].message.content;
  console.log(chalk.greenBright('🧠 Saint~Dr.™: ') + output);
  await logMemory(prompt, output);
}

export async function syncMemory() {
  console.log(chalk.yellow('🔄 Syncing memory via /api/sync-now...'));
  const res = await fetch('http://localhost:3000/api/sync-now');
  if (!res.ok) return console.log(chalk.red('❌ Sync failed'));
  console.log(chalk.green('✅ Memory synced successfully'));
}

export function viewLogs() {
  const file = `.sal/logs/${new Date().toISOString().split('T')[0]}-session.json`;
  if (!fs.existsSync(file)) return console.log(chalk.red('No logs found.'));
  console.log(fs.readFileSync(file, 'utf-8'));
}

async function logMemory(input: string, response: string) {
  const dir = `.sal/logs/`;
  const file = `${dir}${new Date().toISOString().split('T')[0]}-session.json`;
  await fs.ensureDir(dir);
  const entry = { time: new Date().toISOString(), input, response };
  const logs = fs.existsSync(file) ? JSON.parse(await fs.readFile(file, 'utf-8')) : [];
  logs.push(entry);
  await fs.writeFile(file, JSON.stringify(logs, null, 2));
}
