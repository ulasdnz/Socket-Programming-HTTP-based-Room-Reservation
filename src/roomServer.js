import net from "net";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { add } from "./routes/room/add.js";
import { remove } from "./routes/room/remove.js";
import { checkAvailability } from "./routes/room/checkAvailability.js";
import { reserve } from "./routes/room/reserve.js";
import { send400 } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const roomPath = path.join(__dirname, "..", "db", "room.json");

const readRooms = fs.readFileSync(roomPath, { encoding: "utf-8" });
const room = JSON.parse(readRooms);

export default (portNumber) => {
  const server = net.createServer((socket) => {
    socket.on("data", async (buffer) => {
      console.log("\n\n\n");
      console.log("[Room Server] Request to Room Server: \n\n");
      console.log(buffer.toString("utf-8"));
      console.log(
        "\n---------------------------------------------------------\n\n\n"
      );
      const request = buffer.toString("utf-8").split("\r\n");
      let query = "";
      let path = "";

      try {
        path = request[0].split(" ")[1].split("?")[0].slice(1).trim();
        query = request[0].split(" ")[1].split("?")[1].trim();
      } catch (err) {
        return send400(socket, "[Room Server]")
      }

      if (
        path !== "add" &&
        path !== "remove" &&
        path !== "reserve" &&
        path !== "checkavailability"
      ) {
        return send400(socket, "[Room Server]")
      }

      const name = query.split("&")[0].split("name=")[1]?.trim();
      if (name === "" || name == undefined) {
        return send400(socket, "[Room Server]")
      }

      if (path === "add") return add(room, roomPath, name, socket);
      if (path === "remove") return remove(room, roomPath, name, socket);
      if (path === "checkavailability") return checkAvailability(room, name, query, socket);
      if (path === "reserve") return reserve(room, roomPath, name, query, socket);
    });

    socket.on("error", (err) => {
      // console.log(
      //   err + "  can not react to the client with port: ",
      //   socket.remotePort
      // )
    });

    socket.on("end", () => {
      console.log(
        "\n----------------------------------------------------------\n\n"
      );
    });
  });

  server.listen(portNumber);
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log("[Room Server] Address in use, retrying...");
    }
  });
  return server;
};
