import { createHttpResponse } from "../../utils.js";
import { statusCodes } from "../../utils.js";
import { send400 } from "../../utils.js";

export const display = (reservation, query, socket) => {
    
    const reservationID = Number(
        query.split("&")[0].split("id=")[1]?.trim()
      );
      if (
        reservationID == 0 ||
        reservationID == undefined ||
        isNaN(reservationID)
      ) {
        return send400(socket, "[Reservation Server]")
      }

      const rt = reservation.reservations.find((e) => e.id === reservationID);
      if (rt === "" || rt == null || rt.length == 0) {
        return send400(socket, "[Reservation Server]")
      }
      const message = `Reservation ID: ${reservationID} <br>
                       Room Name: ${rt.room}            <br>
                       Activity:  ${rt.activity}        <br>
                       When:  ${rt.when} `;
      const response = createHttpResponse(
        statusCodes[200],
        `Reservation id: ${reservationID}`,
        message
      );
      console.log("[Reservation Server] Response: \n\n");
      console.log(response);
      return socket.end(response);
    
}