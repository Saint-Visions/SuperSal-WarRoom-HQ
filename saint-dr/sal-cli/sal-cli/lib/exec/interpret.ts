import { askAgent, syncMemory, viewLogs } from "../actions";
import { loadPersona } from "../supersal/loadPersona";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function interpret(input: string) {
  const normalized = input.toLowerCase();
  const user = { role: "admin", id: "ryan" };
  const { systemPrompt } = await loadPersona(user);

  const speak = (text: string) => {
    try {
      execSync(`say \"${text.replace(/\"/g, '')}\"`);
    } catch (err) {
      console.log("⚠️ Voice output failed.");
    }
  };

  if (normalized.includes("screenshot")) {
    const imagePath = input.split(" ").pop()?.trim();
    if (!imagePath || !fs.existsSync(imagePath)) {
      return console.log(chalk.red("🖼️ No valid image path found."));
    }
    const visionPrompt = `Analyze this screenshot: ${imagePath}`;
    const response = await askAgent(visionPrompt, systemPrompt);
    console.log("🧠 Supersal:", response);
    speak(response);
    return;
  }

  if (normalized.includes("alert jr") || normalized.includes("call ryan")) {
    console.log(chalk.blue("📞 Sending SMS or triggering Twilio..."));
    speak("Voice alert sent.");
    return;
  }

  if (normalized.startsWith("ask ")) {
    const question = input.replace("ask ", "").trim();
    const response = await askAgent(question, systemPrompt);
    console.log("🧠 Supersal:", response);
    speak(response);
    return;
  }

  if (normalized.includes("sync")) {
    await syncMemory();
    speak("Memory is synced.");
    return;
  }

  if (normalized.includes("log")) {
    viewLogs();
    return;
  }

  const response = await askAgent(input, systemPrompt);
  console.log("🧠 Supersal:", response);
  speak(response);
}
