// *** sketch is the p5 entry point
//
//import p5 from 'p5';
//import Population from "./population";

// set up variables
//  GLOBAL - try to replace
//
// NEAT GLOBALS
// 
var nextConnectionNo = 1000; // WHAT IS THIS??
var population;
var speed = 60;
var superSpeed = 1;
var showBest = false; //true if only show the best of the previous generation
var runBest = false; //true if replaying the best ever game

var humanPlaying = false; //true if the user is playing
var humanPlayer;

var showNothing = false;

// load assets
function preload() {
    // load background images, etc.
    backgroundSprite = loadImage("images/background_faded_stains_ized.jpg");
    // spaceFont = loadFont("fonts/PressStart2P-Regular.ttf");

    /* // sounds
    soundFormats('wav');
    woosh = loadSound('assets/167929__speedenza__whoosh-puff.wav');
    poplaunch = loadSound('assets/545200__theplax__pop-2.wav');
    poplaunch.playMode('sustain'); */
}

function setup() {
    window.canvas = createCanvas(1000, 800);

    //pauseBecauseDead = false;


    population = new Population(1000); // reset 1 for larger pop
    //humanPlayer = new Spout();
}

function draw() {

    drawToScreen();

    if (humanPlaying) { // if the user is controling the ship
        showHumanPlaying();
    } else {
        // first update populations
        if (!population.done()) { //if any players are alive then update them
            population.updateAlive();
        } else {
            //all dead
            //genetic algorithm
            population.naturalSelection();
        }

    }

    // then draw
    writeInfo();
    drawBrain();

}


function showHumanPlaying() {


    if (!humanPlayer.dead) { //if the player isnt dead then move and show the player based on input
        humanPlayer.look();
        humanPlayer.update();
        humanPlayer.show();
    } else { //once done return to ai
        humanPlaying = false;
    }
}

//draws the display screen
function drawToScreen() {

    if (!showNothing) {

        //pretty stuff ***UPDATE***
        image(backgroundSprite, 0, 0, canvas.width, canvas.height);
        colorMode(RGB, 255);
        //fill(230, 240, 255);
        //rect(0, 0, 1000, 800);
        noStroke();
        //fill(140, 180, 210, 255);
        fill(205, 127, 50, 255);
        rect(400, 0, 200, 4); // top goal
        //fill(180, 220, 250, 255);
        fill(205, 127, 50, 255);
        rect(996, 200, 4, 200); // side goal1
        rect(0, 200, 4, 200); // side goal2
    }
}

function drawBrain() { //show the brain of whatever genome is currently showing
    var startX = 0;
    var startY = 130;
    var w = 190;
    var h = 240;

    population.bestPlayer.brain.drawGenome(startX, startY, w, h);
}

//writes info about the best creature
function writeInfo() {
    // style
    fill(20, 20, 20);
    stroke(20, 20, 20);

    var bestCurrentPlayer = population.getCurrentBest();
    textSize(17);
    textAlign(LEFT);

    text("GENERATION " + population.gen, 20, 40);
    text("REMAINING " + population.remaining, 20, 70);
    text("TOP SCORE " + bestCurrentPlayer.score.toFixed(0), 20, 100);
    text("LIFESPAN " + bestCurrentPlayer.lifespan, 20, 130);



}


function keyPressed() {
    switch (key) {
        case 'a':
            //Left
            if (humanPlaying) {
                humanPlayer.left();
            } else {
                showBest = !showBest;
            }
            break;

        case 'd':
            //Right
            if (humanPlaying) {
                humanPlayer.right();
            } else {
                showBest = !showBest;
            }
            break;

        case 's':
            //Poof
            if (humanPlaying) {
                humanPlayer.puff();
            } else {
                showBest = !showBest;
            }
            break;

    }

}
