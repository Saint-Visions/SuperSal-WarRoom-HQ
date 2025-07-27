import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.***REMOVED*** || process.env.AZURE_***REMOVED*** || 'dummy-key-for-development'
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export class OpenAIService {
  async createChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    try {
      if (!process.env.***REMOVED*** && !process.env.AZURE_***REMOVED***) {
        return "SuperSal™ AI response: [API key needed for real AI responses]";
      }

      const response = await openai.chat.completions.create({
        model: options.model || "gpt-4o",
        messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        stream: options.stream || false,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async createStructuredCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: options.model || "gpt-4o",
        messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error: any) {
      throw new Error(`OpenAI structured completion error: ${error.message}`);
    }
  }

  async analyzeImage(base64Image: string, prompt: string = "Analyze this image in detail"): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ],
          },
        ],
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error: any) {
      throw new Error(`OpenAI vision error: ${error.message}`);
    }
  }

  async transcribeAudio(audioBuffer: Buffer, filename: string): Promise<string> {
    try {
      const file = new File([audioBuffer], filename, { type: "audio/wav" });
      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
      });

      return transcription.text;
    } catch (error: any) {
      throw new Error(`OpenAI transcription error: ${error.message}`);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      return response.data[0].embedding;
    } catch (error: any) {
      throw new Error(`OpenAI embedding error: ${error.message}`);
    }
  }
}

export const openaiService = new OpenAIService();
