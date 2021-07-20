var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const {joinUser, removeUser} = require('./users');

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});
let thisRoom = "";
io.on("connection", function (socket) {
	console.log("connected");
	socket.on("join room", (data) => {
		console.log('in room');
		let NewUser = joinUser(socket.id, data.username, data.roomName)
		socket.emit('send data', {id: socket.id, username:NewUser.username, roomname: NewUser.roomname});
		thisRoom = NewUser.roomname;
		console.log(NewUser);
		socket.join(NewUser.roomname);
	});

	socket.on("chat message", (data) => {
		io.to(thisRoom).emit("chat message", {data:data, id: socket.id});
	});

	socket.on("disconnect", () => {
		const user = removeUser(socket.id);
		console.log(user);
		if (user) {
			console.log(user.username + ' has left');
		}
		console.log("disconnected");
	});
})

http.listen(3000);
