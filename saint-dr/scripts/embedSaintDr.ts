import 'dotenv/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { UpstashVectorStore } from '@langchain/community/vectorstores/upstash';
import { Document } from '@langchain/core/documents';

async function run() {
  const docs: Document[] = [
    new Document({
      pageContent: `
        Saint~Dr.™ is your elite AI force multiplier. Trained on operations, execution, legal doctrine, finance, and real estate. 
        He’s executive-class. Ruthless on task. Fiercely loyal. Always one step ahead.
      `,
      metadata: {
        agent: 'executive',
        mission: 'Protect vision. Execute ruthlessly. Suggest wisely.',
      },
    }),
  ];

  await UpstashVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    config: {
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    },
    namespace: 'core-memory',
  });

  console.log('✅ Saint~Dr.™ memory embedded to Upstash vector store.');
}

run().catch((err) => {
  console.error('❌ Failed to embed:', err);
  process.exit(1);
});
