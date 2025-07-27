import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";
import { SpeechConfig, AudioConfig, SpeechRecognizer, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";

export class AzureService {
  private speechConfig: SpeechConfig;

  constructor() {
    const subscriptionKey = process.env.AZURE_SPEECH_KEY || process.env.AZURE_COGNITIVE_SERVICES_KEY || 'dummy-key-for-development';
    const region = process.env.AZURE_SPEECH_REGION || process.env.AZURE_REGION || "eastus";
    
    if (!process.env.AZURE_SPEECH_KEY && !process.env.AZURE_COGNITIVE_SERVICES_KEY) {
      console.log("Azure Speech key not provided - voice features will return mock responses");
    }

    this.speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
    this.speechConfig.speechRecognitionLanguage = "en-US";
    this.speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
  }

  async speechToText(audioBuffer: Buffer): Promise<string> {
    if (!process.env.AZURE_SPEECH_KEY && !process.env.AZURE_COGNITIVE_SERVICES_KEY) {
      return "Demo voice command recognized - API key needed for real voice processing";
    }

    return new Promise((resolve, reject) => {
      try {
        const audioConfig = AudioConfig.fromWavFileInput(audioBuffer);
        const recognizer = new SpeechRecognizer(this.speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(
          (result) => {
            if (result.text) {
              resolve(result.text);
            } else {
              reject(new Error("No speech recognized"));
            }
            recognizer.close();
          },
          (error) => {
            reject(new Error(`Speech recognition error: ${error}`));
            recognizer.close();
          }
        );
      } catch (error: any) {
        reject(new Error(`Azure Speech Service error: ${error.message}`));
      }
    });
  }

  async textToSpeech(text: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const synthesizer = new SpeechSynthesizer(this.speechConfig);

        synthesizer.speakTextAsync(
          text,
          (result) => {
            if (result.audioData) {
              resolve(Buffer.from(result.audioData));
            } else {
              reject(new Error("No audio data generated"));
            }
            synthesizer.close();
          },
          (error) => {
            reject(new Error(`Speech synthesis error: ${error}`));
            synthesizer.close();
          }
        );
      } catch (error: any) {
        reject(new Error(`Azure Speech Service error: ${error.message}`));
      }
    });
  }

  async cognitiveSearch(query: string, indexName: string = "supersal-knowledge"): Promise<any[]> {
    try {
      const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
      const searchKey = process.env.AZURE_SEARCH_KEY;

      if (!searchEndpoint || !searchKey) {
        throw new Error("Azure Search endpoint and key are required");
      }

      const response = await fetch(`${searchEndpoint}/indexes/${indexName}/docs/search?api-version=2023-11-01`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": searchKey,
        },
        body: JSON.stringify({
          search: query,
          queryType: "semantic",
          semanticConfiguration: "default",
          select: "*",
          top: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`Azure Search API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.value || [];
    } catch (error: any) {
      throw new Error(`Azure Cognitive Search error: ${error.message}`);
    }
  }
}

export const azureService = new AzureService();
