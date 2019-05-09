////////////////////////////////////////////////////////
//
// serialport - allows access to Arduino serial port
// express - writing internal api
// ws - web socket allows node to communicate with Node (only send strings)
// WS -> serialport -> p5.serialport.js(Client) -> serialport -> Arduino -> serialport 
// Node -> HTML pages
//
////////////////////////////////////////////////////////

//the p5.serialcontrol app combines managing ports and starting the server into an easy to use GUI

var SerialPort = require("serialport");
var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var connections = new Array;

var app = express();
const wss = new WebSocketServer({port: 8081}); // the webSocket server
var re = /usbmodem/; //testing for the Arduino port
var myPort = new SerialPort(process.argv[2], 9600); //new serialport to connect to Arduino IDE
var parser = new SerialPort.parsers.Readline();

//get the ports from the command line
if (process.argv[2] === '-l') {
  console.log("listing ports: ");
  console.log("-------------------------------------");
  SerialPort.list(function (err, ports) {
    ports.forEach(function (port) {
      console.log(port.comName);
    });
    process.exit(0);
  });
}
else if(re.test(process.argv[2])){
  arduinoPort = process.argv[2];
  console.log("About to open port: ", arduinoPort);
}
else{
  console.log("No valid serial ports available...exiting");
  process.exit(1);
}

//serve the pages
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname,'public/sketch.html'));
});

//methods to format sending data to the p5 serialport
var sendit = function(toSend) {
  var dataToSend = JSON.stringify(toSend);
  for (var c = 0; c < connections.length; c++) {
    try {
      connections[c].send(dataToSend);
    } catch (error) {
      console.log("Error sending: ", error);
    }
  }
};

//open the web socket for the Node app to connect to
wss.on('connection', function(ws){
  console.log("Adding a Client to the Socket");
  connections.push(ws);
  ws.on('message', sendToSerial); //connect the WS to serialPort
  ws.on('close', function(ws){
    console.log("Closing Port");
    connections.splice(connections.indexOf(ws), 1); //remove from array
  });
  ws.on('error', function(err){
    console.log("Error connecting: ", err);
    process.exit(1);
  });
  sendit({method: 'data', data: "hello from the server! "});
});

//open the serial port from the Arduino 
myPort.on('open', () => console.log("Opening the serial port to the arduino! Data rate: ", myPort.baudRate) );
myPort.on('data', readSerialData); //reading from the Arduino
myPort.on('close', () => console.log("Arduino Port Closed"));
myPort.on('error', error => {
  console.log(error); 
});
myPort.pipe(parser);


//send to the arduino -- get the data from P5
function sendToSerial(data){
  var objFromBuffer = JSON.parse(data);
  console.log("sending to serial: ", objFromBuffer.data);
  if(objFromBuffer.data !== undefined){
    myPort.write(objFromBuffer.data); 
  }
}

//buffer only holds one byte at a time - send the data to p5 and all other clients
function readSerialData(data) {
  console.log(data.toString());
  sendit({method: 'data', data: data.toString()});
}
 
app.listen(3000, () => console.log(`App is listening on port 3000!`)); //serve pages from 3000


