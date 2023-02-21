import net from "net";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { send400 } from "./utils.js";
import { reserve } from "./routes/reservation/reserve.js";
import { display } from "./routes/reservation/display.js";
import { fetchAllAvailableHours } from "./routes/reservation/fetchAllAvailableHours.js";
import { listAvailability } from "./routes/reservation/listAvailability.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reservationPath = path.join(__dirname, "..", "db", "reservation.json");

const readReservations = fs.readFileSync(reservationPath, {
  encoding: "utf-8",
});
const reservation = JSON.parse(readReservations);

export default (portNumber, activityServerPortNumber, roomServerPortNumber) => {
  const server = net.createServer((socket) => {
    let listOfDays = [];
    let i = 1;

    socket.on("data", async (buffer) => {
      console.log("\n\n\n");
      console.log("[Reservation Server] Request to Reservation Server: \n\n");
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
        return send400(socket, "[Reservation Server]");
      }

      if (
        path !== "display" &&
        path !== "listavailability" &&
        path !== "reserve"
      ) {
        return send400(socket, "[Reservation Server]");
      }

      let roomName = "";
      if (path === "listavailability" || path === "reserve") {
        roomName = query.split("&")[0].split("room=")[1]?.trim();
        if (roomName === "" || roomName == undefined) {
          return send400(socket, "[Reservation Server]");
        }
      }

      if (path === "reserve")
        return reserve(
          reservation,
          reservationPath,
          roomName,
          query,
          activityServerPortNumber,
          roomServerPortNumber,
          socket
        );

      const day = query.split("&")[1]?.split("day=")[1]?.trim();

      if (path == "listavailability" && day)
        return listAvailability(day, roomName, roomServerPortNumber, socket);

      if (path == "listavailability" && !day) {
        for (let x = 1; x < 8; x++) {
          fetchAllAvailableHours(i, listOfDays, roomName, roomServerPortNumber, socket);
          i++;
        }
        listOfDays = []
        return;
      }

      if (path == "display") return display(reservation, query, socket);
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
      console.log("[Reservation Server] Address in use, retrying...");
    }
  });

  return server;
};
