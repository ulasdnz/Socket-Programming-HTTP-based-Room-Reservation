import fs from "fs";
import { createHttpResponse } from "../../utils.js";
import { sendFileWritingError } from "../../utils.js";
import { statusCodes } from "../../utils.js";
import { send403 } from "../../utils.js";

export const remove = (activities, activityPath, name, socket) => {
    
    if (!activities.names.includes(name)) {
        return send403(socket, "[Activity Server]")
      }

      activities.names.splice(activities.names.indexOf(name), 1);
      return fs.writeFile(activityPath, JSON.stringify(activities), (err) => {
        if (err)
          return sendFileWritingError(
            socket,
            err,
            "Server could not remove the activity."
          );

        const response = createHttpResponse(
          statusCodes[200],
          "Activity Removed",
          "Activity with name " + name + " is successfully removed."
        );
        console.log("[Activity Server] Response from activity server: \n\n");
        console.log(response);
        return socket.end(response);
      });
    
}