import reservation from "./reservationServer.js";
import room from "./roomServer.js";
import activity from "./activityServer.js";

const activityServerPortNumber = process.argv[2];
const roomServerPortNumber = process.argv[3];
const reservationServerPortNumber = process.argv[4];

activity(activityServerPortNumber);
room(roomServerPortNumber);
reservation(
  reservationServerPortNumber,
  activityServerPortNumber,
  roomServerPortNumber
);
