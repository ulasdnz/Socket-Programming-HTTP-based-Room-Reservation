import net from "net";
import { createHttpResponse } from "../../utils.js";
import { statusCodes } from "../../utils.js";
import { send400 } from "../../utils.js";

export const fetchAllAvailableHours = (i, listOfDays, roomName, roomServerPortNumber, socket) => {
    
    const roomClientSocket = new net.Socket();
    roomClientSocket.connect(roomServerPortNumber, "localhost", () => {
      // console.log("Connection from Reservation Server to Room Server");
    });
    console.log(
      "\n\n[Reservation Server] Request from Reservation Server to Room Server: \n\n"
    );
    const request =
      `GET /checkavailability?name=${roomName}&day=${i} HTTTP/1.1\r\n` +
      "Host: localhost\r\n" +
      "Accept: text/html\r\n" +
      "Accepted-Language: en-us,en\r\n" +
      "\r\n";
    console.log(request);
    roomClientSocket.write(request);

    roomClientSocket.on("data", (data) => {
      const responseFromRoomServer = data.toString("utf-8");
      console.log(
        "\n\n[Reservation Server] Response to Reservation Server from Room Server: \n\n"
      );
      console.log(responseFromRoomServer);

      if (listOfDays.length < 6) {
        let hours;
        try {
          hours = responseFromRoomServer
            .split("\r\n")[6]
            .split("h3")[1]
            .slice(2, -2);
        } catch (err) {
          return send400(socket, "[Reservation Server]");
        }
      listOfDays.push({
          day: i,
          message: "<br>" + hours,
        });
      return;
      } else {
        let hours;
        try {
          hours = responseFromRoomServer
            .split("\r\n")[6]
            .split("h3")[1]
            .slice(2, -2);
        } catch (err) {
          return send400(socket, "[Reservation Server]");
        }
        listOfDays.push({
          day: i,
          message: "<br>" + hours,
        });
        listOfDays.sort((a, b) => a.day - b.day);
        const message = listOfDays.map((e) => e.message).join(" \n");
        const response = createHttpResponse(
          statusCodes[200],
          "All Available Hours",
          message
        );
        console.log("\n\n[Reservation Server] Response: \n\n");
        console.log(response);
        socket.end(response);
        listOfDays = []
      }
    });

    roomClientSocket.on("error", (err) => console.log(""));
    roomClientSocket.on("close", () => {
      //console.log("connection has been closed");
      // roomClientSocket.destroy();
    });
  
}