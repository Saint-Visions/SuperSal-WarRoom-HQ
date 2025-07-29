import { OpenAIEmbeddings } from "@langchain/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";

async function main() {
  const loader = new DirectoryLoader("docs", {
    ".txt": (path) => new TextLoader(path),
  });

  const docs = await loader.load();

  await UpstashVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    config: {
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    },
  });

  console.log("✅ Embedded successfully.");
}

main();
