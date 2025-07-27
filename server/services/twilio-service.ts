import twilio from "twilio";

export class TwilioService {
  private client: any;
  private accountSid: string;
  private authToken: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || "";
    this.authToken = process.env.TWILIO_AUTH_TOKEN || "";

    if (!this.accountSid || !this.authToken) {
      console.warn("Twilio credentials not configured");
      return;
    }

    this.client = twilio(this.accountSid, this.authToken);
  }

  async sendSMS(to: string, body: string, from?: string): Promise<any> {
    if (!this.client) {
      throw new Error("Twilio not configured");
    }

    try {
      const message = await this.client.messages.create({
        body,
        from: from || process.env.TWILIO_PHONE_NUMBER,
        to,
      });

      return message;
    } catch (error: any) {
      throw new Error(`Twilio SMS error: ${error.message}`);
    }
  }

  async makeCall(to: string, twimlUrl: string, from?: string): Promise<any> {
    if (!this.client) {
      throw new Error("Twilio not configured");
    }

    try {
      const call = await this.client.calls.create({
        url: twimlUrl,
        to,
        from: from || process.env.TWILIO_PHONE_NUMBER,
      });

      return call;
    } catch (error: any) {
      throw new Error(`Twilio call error: ${error.message}`);
    }
  }

  async getCallLogs(limit: number = 50): Promise<any[]> {
    if (!this.client) {
      throw new Error("Twilio not configured");
    }

    try {
      const calls = await this.client.calls.list({ limit });
      return calls;
    } catch (error: any) {
      throw new Error(`Twilio call logs error: ${error.message}`);
    }
  }

  async getMessageLogs(limit: number = 50): Promise<any[]> {
    if (!this.client) {
      throw new Error("Twilio not configured");
    }

    try {
      const messages = await this.client.messages.list({ limit });
      return messages;
    } catch (error: any) {
      throw new Error(`Twilio message logs error: ${error.message}`);
    }
  }
}

export const twilioService = new TwilioService();
