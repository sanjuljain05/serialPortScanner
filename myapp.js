var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;
app.get('/', function(req, res){
 res.sendFile(__dirname + '/serialReceiver.html');
});

io.on('connection', function(socket){
  console.log('connect');
  socket.on('scanData', function(data){ //scenario has been created
    console.log('scanDataReceived',data);
    io.emit('forwardScanData', data); //add the scenario to the world map
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var portName = "COM5";

var myPort = new SerialPort(portName, {
   baudRate: 9600,
   // look for return and newline at the end of each data packet:
  // parser: serialport.parsers.readline("\n")
   parser: serialport.parsers.raw
 });

/*var sp = new SerialPort(portName, {
  //parser: serialport.parsers.readline("\n")
  parser: serialport.parsers.raw
});


sp.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('open');
    sp.on('data', function(data) {
      console.log('data received: ' + String(data));
      io.emit('scanData',String(data));
    });
  }
});*/

myPort.on('open', showPortOpen);
myPort.on('data',function(data){
	console.log('data received:' + String(data));
	io.emit('scanData' , String(data));
	});

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}

/*function sendSerialData(data) {
  // if there are webSocket connections, send the serial data
  // to all of them:
  console.log('ssd',String(data));
  if (connections.length > 0) {
    broadcast(String(data));
  }
}*/