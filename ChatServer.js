var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket){
  var name = "user"+Date.now();
  socket.emit('name', name); //Send the name to the client on connection
  welcomeBanner(socket);
  io.emit('server message', { datetime: friendlyUTCTime(),
	                             message: ("<b>" + name + "</b> Connected") });
  
  socket.on('chat message', function(msg){
    io.emit('chat message', { datetime: friendlyUTCTime(),
                                  name: name,
                               message: msg });
  });
  
  socket.on('name', function(msg){
	var oldname = name;
	name = msg;
	io.emit('server message', { datetime: friendlyUTCTime(),
	                             message: ("<b>" + oldname + "</b> changed their name to <b>" + name + "</b>") });
  });
  
  socket.on('disconnect', function(msg){
	    io.emit('server message', { datetime: friendlyUTCTime(),
	                             message: ("<b>" + name + "</b> Disconnected") });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function welcomeBanner(socket)
{
	var date = friendlyUTCTime();
	
	socket.emit('server message', { datetime: date,
	                                 message: ("WELCOME TO SOCKET.IO TEST SERVER!!!!") });
	socket.emit('server message', { datetime: date,
	                                 message: ("You're allowed to change your name and chat with other users.") });
	socket.emit('server message', { datetime: date,
	                                 message: ("There's currently only one chat room, but more are on the way (including custom chat rooms and private messages)") });
}

function friendlyUTCTime(){
    var d = new Date();
	//7/11/2015 6:06:28
	return (d.getUTCMonth() + "/" + d.getUTCDate() + "/" + d.getUTCFullYear() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds())
};