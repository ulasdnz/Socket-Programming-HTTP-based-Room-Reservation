import fs from "fs";
import { createHttpResponse } from "../../utils.js";
import { sendFileWritingError } from "../../utils.js";
import { statusCodes } from "../../utils.js";
import { send403 } from "../../utils.js";

export const add = (activities, activityPath, name, socket) => {
    if (activities.names.includes(name)) {
      return send403(socket, "[Activity Server]")
      }

      activities.names.push(name);
      return fs.writeFile(activityPath, JSON.stringify(activities), (err) => {
        if (err)
          return sendFileWritingError(
            socket,
            err,
            "Server could not add the activity."
          );
        const response = createHttpResponse(
          statusCodes[200],
          "Activity Added",
          "Activity with name " + name + " is successfully added."
        );
        console.log("[Activity Server] Response from activity server: \n\n");
        console.log(response);
        return socket.end(response);
      });
   
}