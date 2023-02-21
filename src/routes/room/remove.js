import fs from "fs";
import { createHttpResponse } from "../../utils.js";
import { sendFileWritingError } from "../../utils.js";
import { statusCodes } from "../../utils.js";
import { send403 } from "../../utils.js";

export const remove = (room, roomPath, name, socket) => {
    let indx = 0;

    if (
      !room.rooms.some((rm, i) => {
        if (rm.name === name) indx = i;

        return rm.name === name;
      })
    ) {
      return send403(socket, "[Room Server]")
    }

    room.rooms.splice(indx, 1);
    return fs.writeFile(roomPath, JSON.stringify(room), (err) => {
      if (err)
        return sendFileWritingError(
          socket,
          err,
          "Server could not remove the activity."
        );

      const response = createHttpResponse(
        statusCodes[200],
        "Room Removed",
        "Room with name " + name + " is successfully removed."
      );
      console.log("[Room Server] Response: \n\n");
      console.log(response);
      return socket.end(response);
    });
}