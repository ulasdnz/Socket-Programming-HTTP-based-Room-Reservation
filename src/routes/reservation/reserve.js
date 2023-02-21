import net from "net";
import fs from "fs";
import { createHttpResponse } from "../../utils.js";
import { statusCodes } from "../../utils.js";
import { getDayName } from "../../utils.js";
import { send400 } from "../../utils.js";

export const reserve = (
  reservation,
  reservationPath,
  roomName,
  query,
  activityServerPortNumber,
  roomServerPortNumber,
  socket
) => {
  let day, hour, duration, activityName;

  try {
    activityName = query.split("&")[1].split("activity=")[1]?.trim();
    day = query.split("&")[2].split("day=")[1]?.trim();
    hour = query.split("&")[3].split("hour=")[1]?.trim();
    duration = query.split("&")[4].split("duration=")[1]?.trim();
  } catch (err) {
    return send400(socket, "[Reservation Server]")
  }

  let reqToActivityServer =
    `GET /check?name=${activityName} HTTTP/1.1\r\n` +
    "Host: localhost\r\n" +
    "Accept: text/html\r\n" +
    "Accepted-Language: en-us,en\r\n" +
    "\r\n";

  var activityClientSocket = new net.Socket();
  activityClientSocket.connect(activityServerPortNumber, "localhost", () => {
    // console.log(
    //   "Connection from Reservation Server to Activity Server"
    // );
  });

  console.log(
    "[Reservation Server] Request from Reservation Server to Activity Server: \n\n"
  );
  console.log(reqToActivityServer);
  activityClientSocket.write(reqToActivityServer);

  activityClientSocket.on("data", (data) => {
    const responseFromActivityServer = data.toString("utf-8");
    console.log(
      "[Reservation Server] Response to the Reservation Server from the Activity Server: \n\n"
    );
    console.log(responseFromActivityServer);
    const responseStatus = responseFromActivityServer.split(" ")[1];
    if (responseStatus !== "200") {
      console.log(
        "[Reservation Server] Response from Reservation Server: \n\n"
      );
      console.log(responseFromActivityServer);
      return socket.end(responseFromActivityServer);
    }
    var roomClientSocket = new net.Socket();
    roomClientSocket.connect(roomServerPortNumber, "localhost", () => {
      // console.log("Connection from Reservation Server to Room Server");
    });
    let reqToRoomServer =
      `GET /reserve?name=${roomName}&day=${day}&hour=${hour}&duration=${duration} HTTTP/1.1\r\n` +
      "Host: localhost\r\n" +
      "Accept: text/html\r\n" +
      "Accepted-Language: en-us,en\r\n" +
      "\r\n";

    console.log(
      "[Reservation Server] Request from Reservation Server to Room Server: \n\n"
    );
    console.log(reqToRoomServer);
    roomClientSocket.write(reqToRoomServer);

    roomClientSocket.on("data", (data) => {
      const responseFromRoomServer = data.toString("utf-8");
      const responseStatus = data
        .toString("utf-8")
        .split("\r\n")[0]
        .split(" ")[1];
      console.log(
        "[Reservation Server] Response to Reservation Server from Room Server: \n\n"
      );
      console.log(responseFromRoomServer);

      if (responseStatus !== "200") {
        console.log(
          "[Reservation Server] Response from Reservation Server: \n\n"
        );
        console.log(responseFromRoomServer);
        return socket.end(responseFromRoomServer);
      }
      const reservationID = reservation.reservations.length + 1;
      const newReservation = {
        id: reservationID,
        activity: activityName,
        room: roomName,
        when: `${getDayName(day - 0)} ${hour
          .toString()
          .padStart(2, "0")}:00 - ${(Number(hour) + Number(duration))
          .toString()
          .padStart(2, "0")}:00`,
      };

      reservation.reservations.push(newReservation);

      return fs.writeFile(
        reservationPath,
        JSON.stringify(reservation),
        (err) => {
          if (err) console.log(err);
          const message = `Room ${newReservation.room}  is reserved for activity ${newReservation.activity}
                          on ${newReservation.when}.
                          Your reservation ID is ${newReservation.id}
          `;
          const response = createHttpResponse(
            statusCodes[200],
            "Reservation Successful",
            message
          );
          console.log(
            "[Reservation Server] Response from Reservation Server: \n\n"
          );
          console.log(response);
          return socket.end(response);
        }
      );
    });
    roomClientSocket.on("error", (err) => console.log(""));
    roomClientSocket.on("close", () => {
      //console.log("connection has been closed");
      // roomClientSocket.destroy();
    });
  });

  activityClientSocket.on("error", (err) => console.log(""));
  activityClientSocket.on("close", () => {
    //  console.log("connection has been closed");
    //  activityClientSocket.destroy();
  });
};
