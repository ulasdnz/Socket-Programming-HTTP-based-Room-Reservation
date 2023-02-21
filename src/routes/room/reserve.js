import fs from "fs";
import { createHttpResponse } from "../../utils.js";
import { sendFileWritingError } from "../../utils.js";
import { statusCodes } from "../../utils.js";
import { getDayName } from "../../utils.js";
import { send400 } from "../../utils.js";
import { send403 } from "../../utils.js";

export const reserve = (room, roomPath, name, query, socket) => {
    
    let day, hour, duration;
    let indx = 0;

    if (
      !room.rooms.some((rm, i) => {
        if (rm.name === name) indx = i;
        return rm.name === name;
      })
    ) {
      return send400(socket, "[Room Server]")
    }

    try {
      day = query.split("&")[1].split("day=")[1]?.trim() - 0;
      hour = query.split("&")[2].split("hour=")[1]?.trim() - 0;
      duration = query.split("&")[3].split("duration=")[1]?.trim() - 0;
    } catch (err) {
      return send400(socket, "[Room Server]")
    }
    if (
      isNaN(day) ||
      day < 1 ||
      day > 7 ||
      !Number.isInteger(day) ||
      isNaN(hour) ||
      hour < 9 ||
      hour > 17 ||
      !Number.isInteger(hour) ||
      isNaN(duration) ||
      duration < 1 ||
      duration > 9 ||
      !Number.isInteger(duration)
    ) {
      return send400(socket, "[Room Server]")
    }

    let requestedRoom = room.rooms[indx];
    let hoursOfDay = requestedRoom.days["day" + day];

    for (let i = 0; i < duration; i++) {
      if (hoursOfDay[hour + i] !== "empty") {
        return send403(socket, "[Room Server]")
      }
    }

    let reservedHours = [];
    for (let i = 0; i < duration; i++) {
      hoursOfDay[hour + i] = "reserved";
      let str = `<br> ${(hour + i).toString().padStart(2, "0")}:00 - ${(
        hour +
        i +
        1
      )
        .toString()
        .padStart(2, "0")}:00`;
      reservedHours.push(str);
    }

    return fs.writeFile(roomPath, JSON.stringify(room), (err) => {
      if (err)
        return sendFileWritingError(
          socket,
          err,
          "Server could not remove the activity."
        );

      let message = `<h3> On ${getDayName(day - 0)}, 
        Room ${name} is reserved for the following hours:
                      ${reservedHours.join(",")}  </h3> 
        `;
      const response = createHttpResponse(
        statusCodes[200],
        "Reserved Hours",
        message
      );
      console.log("[Room Server] Response: \n\n");
      console.log(response);
      return socket.end(response);
    });
  
}