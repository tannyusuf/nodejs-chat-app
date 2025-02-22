const { rejects } = require("assert");
const { log } = require("console");
const net = require("net");
const { resolve } = require("path");
const { exit } = require("process");

const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};
const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;
let username = "";

const socket = net.createConnection(
  {
    host: "127.0.0.1",
    port: 3008,
  },

  async () => {
    const askUsername = async () => {
      username += await rl.question("\nPlease enter your username > ");
    };
    await askUsername();

    socket.write(`username-${username}`);

    const ask = async () => {
      const message = await rl.question("Enter a message > ");
      //move the curser one line up
      await moveCursor(0, -1);
      //clear the current line that the cursor is in
      await clearLine(0);
      socket.write(`${id}-message-${message}`);
    };

    ask();

    socket.on("data", async (data) => {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      if (data.toString("utf-8").substring(0, 2) === "id") {
        //When we are getting the id..

        //Everything from the third char up until the end
        id = data.toString("utf-8").substring(3);

        console.log(`\nYour id is ${id}! Welcome ${username}!`);
      } else {
        //When we are getting the message..

        console.log(data.toString("utf-8"));
      }

      ask();
    });

    socket.on("error", (err) => {
      if (err.code === "ECONNRESET") {
        console.log("\n");
        console.log("------------------");
        console.log("Server is down.");
        console.log("------------------");
        console.log("\n");
        process.exit(0);
      }
    });
  }
);
