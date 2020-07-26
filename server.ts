const clientDir = "le-kitchen-du-nightmare-client"

// Load steps and choices answers for each
const steps = require("./instructions.json");
let currentStep = 0;

// The array of connected users
let users: {id: string, name: string}[] = []

// Install express server
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

io.on("connect", (client) => {
  console.log("New connection: " + client.id);
  onConnect(client)

  client.on('updateName', (name: string) => onUpdateName(client, name))
  client.on('disconnect', () => onDisconnect(client));
  client.on('choice', (choiceData) => onChoice(choiceData, client));

  client.on('restart', restart);
});

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);

function onConnect(client) {
  users.push({id: client.id, name: ''});
}

function onDisconnect(client) {
  console.log("Disconnected: " + client.id);
  const user_index = users.findIndex(el => el.id === client.id);
  users.splice(user_index, 1);
  sendUsersToAll();
}

function onUpdateName(client, name: string) {
  const user_index = users.findIndex(el => el.id === client.id);
  let user = users[user_index]
  user.name = name;
  client.emit('nameReceived', user);
  client.emit('currentStep', getCurrentStep());
  sendUsersToAll();
}

function getCurrentStep(){
  return {
    step: currentStep,
    choices: steps[currentStep]
  }
}

function onChoice(choiceData, client) {
  if (choiceData.step !== currentStep) {
    // Looks like the client is not on the right step of the game.
    client.emit('currentStep', getCurrentStep());
  } else {
    handlePlayerChoice(choiceData.choice, client)
  }
}

function handlePlayerChoice(choice, client) {
  const user = getUserByClientID(client.id)
  if(choice == steps[currentStep][0]) {
    if (currentStep === steps.length) {
      io.emit('win', user)
      currentStep = 0;
    } else {
      currentStep += 1;
      io.emit('guess', {user: user, correct: true});
      io.emit('currentStep', getCurrentStep());
    }
  } else {
    io.emit('guess', {user: user, correct: false});
    currentStep = 0;
    io.emit('currentStep', getCurrentStep());
  }
}

function getUserByClientID(clientID: string) {
  return users.find(user => user.id === clientID)
}

function sendUsersToAll() {
  io.emit('users', users.filter(user => !!user.name));
}

function restart() {
  currentStep = 0;
  io.emit('currentStep', getCurrentStep());
}