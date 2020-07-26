const clientDir = "le-kitchen-du-nightmare-client"

// Load steps and choices answers for each
const steps = require("./instructions.json");
let current_step = 0;

//Install express server
const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 8080;

// Serve only the static files form the dist directory
app.use(express.static(__dirname + `/${clientDir}/dist/${clientDir}`));

app.get("/", function (req, res) {
  res.sendFile(
    path.join(`${__dirname}/${clientDir}/dist/${clientDir}/index.html`)
  );
});

io.on("connection", (client) => {
  console.log("New connection: " + client.id);
  client.emit('current', steps[current_step]);
  current_step = current_step < steps.length ? current_step + 1 : -1;
});

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
