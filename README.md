<div align="center" >

# **HTTP Based Room Reservation** 
<br>
</div>
In this project, we implement an HTTP server that acts as a room reservation server. We only use tcp socket to create this http server. We can create activities and rooms and then reserve the room for an activity for the specified hours of the specified day. We use json files as our databases. More details about the project can be found in the Assignment pdf file.
## Usage
To run the program, make sure you have Node.js installed. After installing Node.js, run the app.js file with 3 arguments which are Activity server port number, Room server port number and Reservation server port number. Here's an example:<br><br>
`node app.js 8080 8081 8082`

where 8080 is the Activity server, 8081 is the Room server and 8082 is the Reservation server.
