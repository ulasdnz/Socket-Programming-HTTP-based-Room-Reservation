import { Buffer } from "buffer";

export const statusCodes = {
  200: "200 OK",
  204: "204 No Content",
  400: "400 Bad request",
  403: "403 Forbidden",
  404: "404 Not Found",
  500: "500 Internal server error",
};
const httpVersion = "1.1";

export const createHttpResponse = (status, title, message) => {
  const payload = `<html>
  <head>
  <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"> 
  <title>${title}</title>
  </head>
  <body>
    <h1>${message}</h1>
    </body>
    </html>`;
  const contentLength = Buffer.byteLength(payload, "utf8");
  return (
    "HTTP/" +
    httpVersion +
    " " +
    status +
    "\r\n" +
    "Content-Type: text/html\r\n" +
    `Content-Length: ${contentLength}\r\n` +
    "Cache-control: no-cache, max-age=0\r\n" +
    "Date: " +
    new Date().toUTCString() +
    "\r\n" +
    "\r\n" +
    payload
  );
};

export const createRoom = (name) => {
  const room = new Object();
  room.name = name;
  room.days = {
    day1: {
      9: "empty",
      10: "empty",
      11: "empty",
      12: "empty",
      13: "empty",
      14: "empty",
      15: "empty",
      16: "empty",
      17: "empty",
    },
    day2: {
      9: "empty",
      10: "empty",
      11: "empty",
      12: "empty",
      13: "empty",
      14: "empty",
      15: "empty",
      16: "empty",
      17: "empty",
    },
    day3: {
      9: "empty",
      10: "empty",
      11: "empty",
      12: "empty",
      13: "empty",
      14: "empty",
      15: "empty",
      16: "empty",
      17: "empty",
    },
    day4: {
      9: "empty",
      10: "empty",
      11: "empty",
      12: "empty",
      13: "empty",
      14: "empty",
      15: "empty",
      16: "empty",
      17: "empty",
    },
    day5: {
      9: "empty",
      10: "empty",
      11: "empty",
      12: "empty",
      13: "empty",
      14: "empty",
      15: "empty",
      16: "empty",
      17: "empty",
    },
    day6: {
      9: "empty",
      10: "empty",
      11: "empty",
      12: "empty",
      13: "empty",
      14: "empty",
      15: "empty",
      16: "empty",
      17: "empty",
    },
    day7: {
      9: "empty",
      10: "empty",
      11: "empty",
      12: "empty",
      13: "empty",
      14: "empty",
      15: "empty",
      16: "empty",
      17: "empty",
    },
  };

  return room;
};

export const send400 = (socket, serverName) => {
  const response = "HTTP/" + httpVersion + " " + statusCodes[400] + "\r\n";
  console.log(serverName+" Response: \n\n");
  console.log(response);
  return socket.end(response);
};

export const send403 = (socket, serverName) => {
  const response = "HTTP/" + httpVersion + " " + statusCodes[403] + "\r\n";
  console.log(serverName+" Response: \n\n");
  console.log(response);
  return socket.end(response);
};


export const getDayName = (dayNumber) => {
  if (dayNumber === 1) return "Monday";
  if (dayNumber === 2) return "Tuesday";
  if (dayNumber === 3) return "Wednesday";
  if (dayNumber === 4) return "Thursday";
  if (dayNumber === 5) return "Friday";
  if (dayNumber === 6) return "Saturday";
  if (dayNumber === 7) return "Sunday";
};

export const sendFileWritingError = (socket, err, message) => {
  const response = createHttpResponse(
    statusCodes[500],
    "Error",
    `${message} An error occured while writing file.`
  );
  console.log("[Room Server] Got An Error while Writing File:\n" + err);
  console.log(response);
  return socket.end(response);
};

export const createResponseToFaviconRequest = () => {
  return (
    "HTTP/" +
    httpVersion +
    " " +
    statusCodes[204] +
    "\r\n" +
    "Content-Type: text/html\r\n" +
    "Content-Length: 0\r\n" +
    "Cache-control: no-cache, max-age=0\r\n" +
    "Date: " +
    new Date().toUTCString() +
    "\r\n" +
    "\r\n"
  );
  // return (
  //   "HTTP/" +
  //   httpVersion +
  //   " " +
  //   statusCodes[200] +
  //   "\r\n" +
  //   "Content-Type: image/x-icon\r\n" +
  //   //"Content-Length: 0\r\n"+
  //   "Cache-control: no-cache, max-age=0\r\n" +
  //   "Date: " +
  //   new Date().toUTCString() +
  //   "\r\n" +
  //   "\r\n"
  // );
};
