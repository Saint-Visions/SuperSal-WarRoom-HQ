import { apiRequest } from "./queryClient";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  sessionId?: string;
}

export class AIService {
  async createChatCompletion(
    messages: ChatMessage[], 
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    try {
      const response = await apiRequest("POST", "/api/chat/completions", {
        messages,
        model: options.model || "gpt-4o",
        maxTokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        sessionId: options.sessionId,
      });
      
      const data = await response.json();
      return data.response;
    } catch (error: any) {
      throw new Error(`AI completion error: ${error.message}`);
    }
  }

  async uploadFile(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('File upload failed');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(`File upload error: ${error.message}`);
    }
  }

  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const response = await fetch('/api/voice/speech-to-text', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Speech recognition failed');
      }
      
      const data = await response.json();
      return data.text;
    } catch (error: any) {
      throw new Error(`Speech-to-text error: ${error.message}`);
    }
  }

  async textToSpeech(text: string): Promise<Blob> {
    try {
      const response = await apiRequest("POST", "/api/voice/text-to-speech", { text });
      
      if (!response.ok) {
        throw new Error('Text-to-speech failed');
      }
      
      return await response.blob();
    } catch (error: any) {
      throw new Error(`Text-to-speech error: ${error.message}`);
    }
  }

  async searchKnowledge(query: string, indexName?: string): Promise<any[]> {
    try {
      const response = await apiRequest("POST", "/api/search", {
        query,
        indexName: indexName || "supersal-knowledge"
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Knowledge search error: ${error.message}`);
    }
  }

  async createMemory(type: string, content: string, metadata?: any): Promise<any> {
    try {
      const response = await apiRequest("POST", "/api/ai-memory", {
        type,
        content,
        metadata,
      });
      
      return await response.json();
    } catch (error: any) {
      throw new Error(`Memory creation error: ${error.message}`);
    }
  }
}

export const aiService = new AIService();
