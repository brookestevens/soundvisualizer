/*
 *  Program to turn on neopixels 
 *  sends serial data to web app
 *  sends pulses of lights on beat detection
 *  
 */

#include <Adafruit_NeoPixel.h>

#define PIN 9
#define NUM_LIGHTS 60

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LIGHTS, PIN, NEO_GRB + NEO_KHZ800);

void resetLights(int lights){
  for(int i = 0; i < lights; i++){
    strip.setPixelColor(i,255,0,0);
    strip.setBrightness(50);
    strip.show();
  }

}

void lightPixels(){
  for(int i = 0; i< NUM_LIGHTS; i++){
    strip.setPixelColor(i,255,0,0);
    strip.setBrightness(50);
    strip.show();
  }
  delay(500);
}

void sendLightChunk(){
  for(int i = 0; i<NUM_LIGHTS; i+=2){
    strip.setPixelColor(i,0,255,0);
    strip.setPixelColor(i+1,0,255,0);
    strip.setPixelColor(i+2,0,255,0);
    strip.setBrightness(50);
    strip.show();
    //set all the previous lights back to red
    resetLights(i);
  }

}


void setup() {
  Serial.begin(9600);
  strip.begin(); 
  randomSeed(analogRead(0));
}

int randomNum;
int r = 0,g = 50,b = 255;

void setColor(){
  r = floor(random(255));
  g = r;
  b = g;
}

void loop(){
  
  if(Serial.available() > 0){
    randomNum = floor(random(55)); //so the the last 2 lights can light up too
    //setColor();
    char inData = Serial.read();
    if(inData == 'b'){
      strip.setPixelColor(randomNum,r,g,b);
      strip.setPixelColor(++randomNum,r,g,b);
      strip.setPixelColor(++randomNum,r,g,b);
      strip.setPixelColor(++randomNum,r,g,b);
      strip.setPixelColor(++randomNum,r,g,b);
      strip.setBrightness(50);
      strip.show();
    }
  }
  //delay(50);
  lightPixels();
  //sendLightChunk();
  
}







