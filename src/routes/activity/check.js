import { statusCodes } from "../../utils.js";

const httpVersion = "1.1";

export const check = (activities, name, socket)=> {
    if (activities.names.includes(name)) {
        const response = "HTTP/" + httpVersion + " " + statusCodes[200] + "\r\n";
        console.log("[Activity Server] Response from activity server: \n\n");
        console.log(response);
        return socket.end(response);
      }
      const response = "HTTP/" + httpVersion + " " + statusCodes[404] + "\r\n";
      console.log("[Activity Server] Response from activity server: \n\n");
      console.log(response);
      return socket.end(response);
}