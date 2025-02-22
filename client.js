const { rejects } = require("assert");
const net = require("net");
const { resolve } = require("path");

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

const socket = net.createConnection(
  {
    host: "127.0.0.1",
    port: 3008,
  },

  async () => {
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

        console.log(`Your id is ${id}! Welcome!\n `);
      } else {
        //When we are getting the message..

        console.log(data.toString("utf-8"));
      }

      ask();
    });
  }
);
