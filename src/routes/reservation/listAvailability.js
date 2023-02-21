import net from "net";

export const listAvailability = (day, roomName, roomServerPortNumber, socket) => {
    
    const roomClientSocket = new net.Socket();
    roomClientSocket.connect(roomServerPortNumber, "localhost", () => {
      //console.log("Connection from Reservation Server to Room Server");
    });

    let reqToRoomServer =
      `GET /checkavailability?name=${roomName}&day=${day} HTTTP/1.1\r\n` +
      "Host: localhost\r\n" +
      "Accept: text/html\r\n" +
      "Accepted-Language: en-us,en\r\n" +
      "\r\n";

    console.log(
      "\n\n[Reservation Server] Request from Reservation Server to Room Server: \n\n"
    );
    console.log(reqToRoomServer);
    roomClientSocket.write(reqToRoomServer);

    roomClientSocket.on("data", (data) => {
      const responseFromRoomServer = data.toString("utf-8");
      console.log(
        "\n\n[Reservation Server] Response to Reservation Server from Room Server: \n\n"
      );
      console.log(responseFromRoomServer);

      console.log("\n\n[Reservation Server] Response: \n\n");
      console.log(responseFromRoomServer);
      return socket.end(responseFromRoomServer);
    });

    roomClientSocket.on("error", (err) => console.log(""));
    roomClientSocket.on("close", () => {
      //console.log("connection has been closed");
      // roomClientSocket.destroy();
    });
  
}