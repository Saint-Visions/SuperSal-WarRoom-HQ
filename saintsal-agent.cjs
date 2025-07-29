const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const COMMAND_FILE = path.join(__dirname, "saintsal_command.json");
const COMMAND_INDEX = path.join(__dirname, "saintsal_commands.json");
let lastCommand = "";

function checkAndExecute() {
  if (!fs.existsSync(COMMAND_FILE) || !fs.existsSync(COMMAND_INDEX)) return;

  const input = JSON.parse(fs.readFileSync(COMMAND_FILE, "utf-8"));
  const commands = JSON.parse(fs.readFileSync(COMMAND_INDEX, "utf-8"));

  const key = input.command?.trim();
  const command = commands[key] || key;

  if (command && command !== lastCommand) {
    console.log(`\n🚀 Executing: ${command}\n`);
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Error: ${err.message}`);
        return;
      }
      if (stderr) console.error(`⚠️ stderr: ${stderr}`);
      if (stdout) console.log(`✅ stdout:\n${stdout}`);
    });
    lastCommand = command;
  }
}

console.log("🧠 Dr. Saint is now live. Listening for commands...");
setInterval(checkAndExecute, 3000);
