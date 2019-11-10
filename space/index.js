var express = require("express");
var app = express();

var http = require("http");
var server = http.Server(app);

var socketio = require("socket.io");
var io = socketio(server);

var clients = {};
var players = {};
var connectedPlayers = {};
var dockInventory = 0;


app.use(express.static("pub"));

io.on('connection', function(socket){
  clients[socket.id] = socket;
 
 for(var key in players)
	for (var id in clients)
		if (players[key].username == clients[id].username)
			connectedPlayers[players[key].username] = players[key];

  io.emit('add current players', connectedPlayers);
  socket.emit('receive player id', socket.id);

  socket.on('disconnect', function(){
	var playerTuple = [];
	playerTuple.push(clients[socket.id].username);
	playerTuple.push(players[socket.id]);
	socket.broadcast.emit('client disconnecting', playerTuple);
	delete connectedPlayers[clients[socket.id].username];
        delete clients[socket.id];

//	delete players[socket.id];
  });

  socket.on('message', function(msg){
    io.emit('message', msg);
  });

  socket.on('update commodities', function (inventory){
	console.log("hey");
	dockInventory = inventory;
	io.emit('load inventory', inventory);
  });

  socket.on('login attempt', function(login){
  	if (login[0] in players){
		if (login[1] == players[login[0]].passcode)
			//player exists, give player to user.
			socket.emit('login ok', players[login[0]]);
		else
			socket.emit('login bad');
	}
	else{
		//new player created
		socket.emit('login ok', 0);
	}
  });

  socket.on('player joined', function(newPlayer){
	var newPlayerTuple = [];
	connectedPlayers[newPlayer.username] = newPlayer;
	clients[socket.id] = newPlayer;
	socket.broadcast.emit('player joined', newPlayer);
  });

  socket.on('newuser', function(username){
     io.emit('message', username + ' has joined the game.');
  });

  socket.on('position change', function(player){
	console.log(player.position);
        players[player.username] = player;
	socket.broadcast.emit('position change', player);
  });


});



server.listen(3005, function(){
  console.log('listening on *:3005');
});
