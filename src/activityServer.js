import net from "net";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { send400 } from "./utils.js";
import { createResponseToFaviconRequest } from "./utils.js";
import { add } from "./routes/activity/add.js";
import { remove } from "./routes/activity/remove.js";
import { check } from "./routes/activity/check.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const activityPath = path.join(__dirname, "..", "db", "activity.json");

const readActivities = fs.readFileSync(activityPath, { encoding: "utf-8" });
const activities = JSON.parse(readActivities);

export default (portNumber) => {
  const server = net.createServer((socket) => {
    socket.on("data", async (buffer) => {
      console.log("\n\n\n");
      console.log("[Activity Server] Request to Activity Server: \n\n");
      console.log(buffer.toString("utf-8"));
      console.log(
        "\n---------------------------------------------------------\n\n\n"
      );
      const request = buffer.toString("utf-8").split("\r\n");
      let query = "";
      let path = "";

      //Checks if its a favicon request from the browser.
      if (request[0].split(" ")[1] === "/favicon.ico") {
        const response = createResponseToFaviconRequest();
        console.log("[Activity Server] Response from activity server: \n\n");
        console.log(response);
        return socket.end(response);
      }

      try {
        path = request[0].split(" ")[1].split("?")[0].slice(1).trim();
        query = request[0].split(" ")[1].split("?")[1].trim();
      } catch (err) {
        return send400(socket, "[Activity Server]")

      }

      if (path !== "add" && path !== "remove" && path !== "check") {
        return send400(socket, "[Activity Server]")
      }

      const name = query.split("name=")[1]?.trim();
      if (name === "" || name == undefined) {
        return send400(socket, "[Activity Server]")
      }

      if (path === "add") return add(activities, activityPath, name, socket);
      if (path === "remove") return remove(activities, activityPath, name, socket);
      if (path === "check") return check(activities, name, socket);
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
      console.log("[Activity Server] Address in use, retrying...");
    }
  });
  return server;
};
