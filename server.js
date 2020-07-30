var clientDir = "le-kitchen-du-nightmare-client";
// Load steps and choices answers for each
var steps = require("./instructions.json");
var currentStep = 0;
// The array of connected users
var users = [];
// Install express server
var express = require("express");
var path = require("path");
var http = require("http");
var socketIO = require("socket.io");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var port = process.env.PORT || 8080;
// Serve only the static files form the dist directory
app.use(express.static(__dirname + ("/" + clientDir + "/dist/" + clientDir)));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/" + clientDir + "/dist/" + clientDir + "/index.html"));
});
io.on("connect", function (client) {
    console.log("New connection: " + client.id);
    onConnect(client);
    client.on("updateName", function (name) { return onUpdateName(client, name); });
    client.on("disconnect", function () { return onDisconnect(client); });
    client.on("choice", function (choiceData) { return onChoice(choiceData, client); });
    client.on("restart", restart);
});
server.listen(port);
console.log("Server listening on http://localhost:" + port);
function onConnect(client) {
    users.push({ id: client.id, name: "" });
}
function onDisconnect(client) {
    console.log("Disconnected: " + client.id);
    var user_index = users.findIndex(function (el) { return el.id === client.id; });
    users.splice(user_index, 1);
    sendUsersToAll();
}
function onUpdateName(client, name) {
    var user_index = users.findIndex(function (el) { return el.id === client.id; });
    var user = users[user_index];
    user.name = name;
    client.emit("nameReceived", user);
    client.emit("currentStep", getCurrentStep());
    client.emit("answers", getCurrentAnswers());
    sendUsersToAll();
}
function getCurrentStep() {
    return {
        step: currentStep,
        choices: steps[currentStep]
    };
}
function getCurrentAnswers() {
    return steps.slice(0, currentStep).map(function (answers) { return answers[0]; });
}
function onChoice(choiceData, client) {
    if (choiceData.step !== currentStep) {
        // Looks like the client is not on the right step of the game.
        client.emit("currentStep", getCurrentStep());
    }
    else {
        handlePlayerChoice(choiceData.choice, client);
    }
}
function handlePlayerChoice(choice, client) {
    var user = getUserByClientID(client.id);
    if (choice == steps[currentStep][0]) {
        currentStep += 1;
        if (currentStep === steps.length) {
            io.emit("win", user);
            currentStep = 0;
        }
        else {
            io.emit("guess", { user: user, correct: true });
        }
    }
    else {
        io.emit("guess", { user: user, correct: false });
        currentStep = 0;
    }
    io.emit("answers", getCurrentAnswers());
    io.emit("currentStep", getCurrentStep());
}
function getUserByClientID(clientID) {
    return users.find(function (user) { return user.id === clientID; });
}
function sendUsersToAll() {
    io.emit("users", users.filter(function (user) { return !!user.name; }));
}
function restart() {
    currentStep = 0;
    io.emit("answers", getCurrentAnswers());
    io.emit("currentStep", getCurrentStep());
}
