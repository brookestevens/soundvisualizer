# soundvisualizer
Visualizer for music and connects to neopixel strip
<h1> Summary </h1>
<p> 
Using p5.js and Arduino, I'm going to try to to make an audio visualizer that will send data to neopixel strip lights based on specific frequencies. The http pages are hosted with Express and the serial port to the Arduino is opened with the serialport module. Also, A web socket server is made with the node ws module. In the client, I used P5 and the p5.serialport.js file to connect p5 to the web socket. 
</p>
<p>
I know about the p5.serialcontrol app, but I wanted to figure how that worked internally. Also, I used part ofthe p5 serial server module. I copy pasted the p5.serialport.js file and the sendit() method.
</p>
</br>
<h2> Software Used: </h2>
<ul>
  <li> P5.js </li>
  <li> Arduino </li>
  <li> Node.js </li>
  <li> Express </li>
  <li> p5.serialport.js </li>
  <li> ws </li>
  <li> serialport </li>
</ul>
