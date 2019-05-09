///////////////////////////////////////////////////
//
// Sound visualizer for Arduino with p5
// Sending serial data by connecting to web socket
// hopefully will be able to integrate the apple music API for better song selection
// 
//
///////////////////////////////////////////////////


//connect to web socket server (Node)
var _message = document.getElementById("message");
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
    var objFromMessage = JSON.parse(message.data);
    console.log("web socket: ", objFromMessage.data );
    _message.innerHTML = `${objFromMessage.data}`;
}

/////////////////////////////////////////////////////////////////
//
// THE p5 Code: 
//
/////////////////////////////////////////////////////////////////

var fft,peak, value = 0, spectrum, x, h, beat = 0;
var mySound = [];
var maxVol = 0; 
//var randomNum = Math.floor(Math.random() * 2);
var randomNum = 0;
var sum = 0;
var minVol = 256;
var inData, serial;


//for getting data from the Arduino
function serialEvent(){
    inData = serial.read();
    console.log("indata is: ", inData);
}

//run before setup
function preload(){
    mySound.push(loadSound('public/song.mp3', function(){console.log("successfully loaded the song")}));
    //mySound.push(loadSound('jellyfish-song.mp3'));
    //mySound.push(loadSound('my-sorrow.mp3'));
}

function setup(){
    createCanvas(windowWidth, 300);

    serial = new p5.SerialPort();

    serial.on('connected', () => console.log("Connected to the server"));
    serial.on('open', () => console.log("The serial port opened!"));
    serial.on('data', serialEvent);
    serial.on('error', (err) => console.log("something went wrong with the port " + err));
    serial.on('close', () => console.log("The port closed"));

    serial.open('/dev/cu.usbmodem14201');
    
    fft = new p5.FFT(.8,256); //fast fourier transform
    peak = new p5.PeakDetect();
    colorMode(HSB);
    //beat detected
    peak.onPeak(showBeat);
}

function draw(){
    background(20);
    spectrum = fft.analyze(); //frequencies
    peak.update(fft);
    beat++;

    fill(20);
    stroke(255);
    circle(width/2, height/2, beat);
    
    for(var i = 0; i< spectrum.length; i++){
        x = map(i,0,spectrum.length, 0, 600);
        h = -height + map(spectrum[i], 0, 255, height, 0);
        //fill(spectrum[i]%360, spectrum[i], 255);
        //rect(x*5, height, 5, h);
        sum += spectrum[i];
        if(Math.floor(fft.getEnergy(spectrum[i])) < minVol) minVol = fft.getEnergy(spectrum[i]);
        if(Math.floor(fft.getEnergy(spectrum[i])) > maxVol) maxVol = fft.getEnergy(spectrum[i]);
        
        
        noStroke();
        fill(255);
        circle(x*5, h+200+minVol, 2);
        fill(255);
        circle(x*5, h+maxVol, 2);
               
    }
    //console.log(`Average of the frequencies is: ${Math.floor(sum/256)} and max/min Vol is: ${maxVol} & ${minVol}`); //array size is always 256 indexes
    maxVol = 0;
    minVol = 256;
    sum = 0;

}

var count = 0;

//slow down the signals sent
//send b char when beat is detected
function showBeat(){
    beat = 0;
    serial.write("b");
    console.log("beat detected");
}

function keyPressed() {
    //begin song on up arrow
    if(keyCode ===  UP_ARROW && !mySound[randomNum].isPlaying()){
        mySound[randomNum].play();
    }
    if (mySound[randomNum].isPlaying()) { 
      mySound[randomNum].pause();

    } else {
      mySound[randomNum].loop();
    }
}

