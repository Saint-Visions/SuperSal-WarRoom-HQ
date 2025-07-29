const fs = require("fs");
const { execSync } = require("child_process");

console.log("\n🧬 Cousin Sal has entered the command line. Loyalty loaded. Legacy active.");

const COMMAND_FILE = "./saintsal_command.json";
let lastCommand = "";

fs.watchFile(COMMAND_FILE, { interval: 1000 }, (curr, prev) => {
  try {
    const data = fs.readFileSync(COMMAND_FILE, "utf8");
    if (data && data !== lastCommand) {
      lastCommand = data;
      const { command } = JSON.parse(data);
      console.log(`🛠️  Executing: ${command}`);

      switch (command) {
        case "deploy":
          execSync("vercel --prod", { stdio: "inherit" });
          break;
        case "build":
          execSync("npm run build", { stdio: "inherit" });
          break;
        case "start":
          execSync("npm run start", { stdio: "inherit" });
          break;
        case "logs":
          execSync("open https://vercel.com/dashboard", { stdio: "inherit" });
          break;
        default:
          console.warn(`⚠️ Unknown command: ${command}`);
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
});

