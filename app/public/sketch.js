///////////////////////////////////////////////////
//
// Sound visualizer for Arduino with p5
// Sending serial data by connecting to web socket
// hopefully will be able to integrate the apple music API for better song selection
// 
//
///////////////////////////////////////////////////


//connect to web socket server (Node)
var message = document.getElementById("message");
var title = document.getElementById("title");
var ws = new WebSocket("ws://localhost:8081");

ws.onopen = function(){
    title.innerHTML = "connected to the web socket";

}

//event listeners - fires when socket closes
ws.onclose = function(){ 
    title.innerHTML = "closed"
}

//event fires when message is recieved from server
ws.onmessage = function(message){
    message.innerHTML = message.data;
}

//the P5 Code!
var fft, mySound, value = 0, spectrum, x, h;
var inData, serial;

function serialEvent(){
    inData = serial.read();
    console.log("indata is: ", inData);
}

//run before setup
function preload(){
    mySound = loadSound('public/song.mp3', function(){console.log("success")});
}

function setup(){
    serial = new p5.SerialPort();

    serial.on('connected', () => console.log("Connected to the server"));
    serial.on('open', () => console.log("The serial port opened!"));
    serial.on('data', serialEvent);
    serial.on('error', (err) => console.log("something went wrong with the port " + err));
    serial.on('close', () => console.log("The port closed"));

    serial.open('/dev/cu.usbmodem14201');


    createCanvas(600, 300);
    background(0);
//     fft = new p5.FFT(.8,256); //fast fourier transform
//     colorMode(HSB);
//     mySound.play();
}

// function draw(){
//     

//     fill(value);
//     rect(20,20,50,50);
//
//     spectrum = fft.analyze(); //frequencies
//     noStroke();
//     for(var i = 0; i< spectrum.length; i++){
//         x = map(i,0,spectrum.length, 0, width);
//         h = -height + map(spectrum[i], 0, 255, height, 0);
//         fill(255, i%360, i%360);
//         rect(x*5, height, width/70, h);
//     }

// }

// function keyPressed() {
//     if (mySound.isPlaying()) {
//       mySound.pause();

//     } else {
//       mySound.loop();
//     }
// }
