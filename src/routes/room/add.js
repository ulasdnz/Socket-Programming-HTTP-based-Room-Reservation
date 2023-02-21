import fs from "fs";
import { createHttpResponse } from "../../utils.js";
import { createRoom } from "../../utils.js";
import { sendFileWritingError } from "../../utils.js";
import { statusCodes } from "../../utils.js";
import { send403 } from "../../utils.js";

export const add = (room, roomPath, name, socket) => {
    for (let rm of room.rooms) {
        if (rm.name === name) {
          return send403(socket, "[Room Server]")
        }
      }
      let newRoom = createRoom(name);
      room.rooms.push(newRoom);

      return fs.writeFile(roomPath, JSON.stringify(room), (err) => {
        if (err)
          return sendFileWritingError(
            socket,
            err,
            "Server could not add the room."
          );
        const response = createHttpResponse(
          statusCodes[200],
          "Room Added",
          "Room with name " + name + " is successfully added."
        );
        console.log("[Room Server] Response: \n\n");
        console.log(response);
        return socket.end(response);
      });
}