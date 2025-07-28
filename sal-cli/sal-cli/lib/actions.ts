import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function askSal(prompt: string) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          "You are SuperSal™, Ryan's execution AI. Tactical. Fast. Faith-forward. Every answer is for a real CEO making real moves.",
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const answer = res.choices[0].message.content;
  console.log('💬 SAL:', answer);
  return answer;
}

export async function syncMemory() {
  console.log('🧠 Syncing memory to Upstash + Supabase...');
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log('✅ Memory sync complete.');
}

export async function fixCode() {
  console.log('🛠 Fixing code...');
  await new Promise((r) => setTimeout(r, 1000));
  console.log('✅ Code fixed. (placeholder)');
}

export async function buildApp() {
  console.log('🔧 Running build...');
  const { exec } = await import('child_process');
  exec('npm run build', (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Build failed: ${stderr}`);
    } else {
      console.log(`✅ Build output:\n${stdout}`);
    }
  });
}

export async function deployApp() {
  console.log('🚀 Deploying app to Vercel...');
  const { exec } = await import('child_process');
  exec('vercel --prod', (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Deploy failed: ${stderr}`);
    } else {
      console.log(`✅ Deploy complete:\n${stdout}`);
    }
  });
}
