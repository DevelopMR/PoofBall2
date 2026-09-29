class Spout {
    constructor() {
        this.x;
        do {
            this.x = 40 + (canvas.width - 40) * Math.random();
        } while ((this.x > 400) && (this.x < 600));

        this.y = canvas.height;
        this.speed = 7;
        this.velX = 0;
        this.maxVel = 2 + 2 * Math.random();
        this.size = 30;
        this.halfSize = this.size / 2;
        this.doubleSize = this.size * 2;
        this.direction = 0; // randomise?
        this.visionRange = 125 + 50 * Math.random();

        this.TwoPI = 2 * Math.PI;

        this.isBest = false;

        this.color = this.StartColor();
        this.hullColor = color(hue(this.color), int(saturation(this.color) * .8), int(brightness(this.color) / 3), 100);
        this.fieldColor = color(hue(this.color), int(saturation(this.color) * .8), int(brightness(this.color)), 50);

        this.bubble = new Bubble(this);
        this.livePoof = false;
        this.poof;
        this.justPoofed = 0; // counter for visualising poofing action
        this.poofVisualLimit = 10; // number of game cycles

        // genome PROJECT SPECIFIC
        // Vision values
        this.vision0 = 0; // PLAYER X-POS
        this.vision1 = 0; // bubble x-delta
        this.vision2 = 0; // bubble y-pos


        // Response values
        this.response0 = 0; // move left
        this.response1 = 0; // move right
        this.response2 = 0; // poof


        //-----------------------------------------------------------------------
        //neat stuff
        this.fitness = 0;
        this.vision = []; //the input array fed into the neuralNet
        this.decision = []; //the out put of the NN
        this.unadjustedFitness;

        this.lifespan = 0; //how long the player lived for this.fitness
        this.bestScore = 0; //stores the this.score achieved used for replay
        this.dead = false;
        this.score = 0;
        this.topGoalScore = 0;
        this.leftGoalScore = 0;
        this.rightGoalScore = 0;
        this.gen = 0;


        this.brainInputs = 3;
        this.brainOutputs = 3;

        this.brain = new Brain(this.brainInputs, this.brainOutputs);

    }

    StartColor() {
        colorMode(HSB, 100);
        var randHSB = color(random(100), random(100), random(100));
        return randHSB;
    }

    show() {

        // first show the spout's bubble
        this.bubble.show();


        colorMode(HSB, 100);

        // show pebble
        push();
        translate(this.x, this.y);

        stroke(this.color);

        fill(this.fieldColor);
        strokeWeight(1);

        if ((this.livePoof) && (this.justPoofed < this.poofVisualLimit)) {
            ellipse(0, 0, this.halfSize, this.doubleSize);
        }
        else {
            ellipse(0, 0, this.size, this.size);
        }

        colorMode(RGB, 255);

        pop();

    }


    highlight() {
        colorMode(RGB, 255);
        noFill();
        stroke(255, 0, 0);
        ellipse(this.x, this.y, 2 * this.visionRange, 2 * this.visionRange);

        noStroke();
        fill(255, 255, 255);

    }

    // ACTIONS

    left() {
        this.x -= this.speed;
    }

    right() {
        this.x += this.speed;
    }

    puff() {
        if (!this.livePoof) {
            this.poof = new Poof(this);
            this.livePoof = true;
            this.justPoofed = 0;

            // sound
            //poplaunch.play(); // too laggy

        }
    }

    thruGoal() {

        this.score += 1000;
        this.topGoalScore += 1000;
        //delete this.poof;
        this.bubble = new Bubble(this);
    }

    thruSideGoal() {
        const sideScoreAmt = 1500;

        this.score += sideScoreAmt;

        if (this.bubble.x < 0) {
            this.rightGoalScore += sideScoreAmt;
        }
        else {
            this.leftGoalScore += sideScoreAmt;
        }

        this.bubble = new Bubble(this);
    }

    move() {

        // console.log("VX: " + this.velX + "  VY: " + this.velY);
        //this.y += this.velY;
        this.x += this.velX;

    }

    update() {
        this.lifespan++;
        this.bubble.update();

        if (this.livePoof) {
            this.poof.update();
            this.justPoofed++; // determines pebble shape
        }

        this.score += .01; // win just by living
        //this.puddle.move();
        this.move();
        this.checkCollisions();

    }

    checkCollisions() {

        // check for life

        // xy boundary checks
        if (this.x < this.size) {
            this.dead = true;
        }
        if (this.x > (canvas.width - this.size)) {
            this.dead = true;
        }

    }

    look() {
        this.vision = []; //clear

        // DO FOR ALL INPUTS
        this.vision[0] = map(this.x, 0, 1000, 0, 1); // player x-pos 
        this.vision[1] = map(this.bubble.x - this.x, -1000, 1000, -1, 1); // bubble x-delta
        this.vision[2] = map(this.bubble.y, 0, 800, 0, 1); // bubble y-pos

    }




    think() {
        //get the output of the neural network
        this.decision = this.brain.feedForward(this.vision);


        const velChangeFactor = .5;
        const thoughtSensitivity = .75;
        const puffThoughtSensitivity = .85; // .85 base

        if (this.decision[0] > thoughtSensitivity) {
            this.left();
        }
        if (this.decision[1] > thoughtSensitivity) {
            this.right();
        }
        if (this.decision[2] > puffThoughtSensitivity) {
            this.puff();
        }

    }


    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns a clone of this spout
    clone() {
        var clone = new Spout();
        clone.brain = this.brain.clone();
        clone.fitness = this.fitness;
        clone.brain.generateNetwork();
        clone.gen = this.gen;
        clone.bestScore = this.score;
        print("cloning done");
        return clone;
    }


    //-------------------------------------------
    //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
    //this fuction does that

    cloneForReplay() {
        var clone = new Spout(); // Player();
        clone.brain = this.brain.clone();
        clone.fitness = this.fitness;
        clone.brain.generateNetwork();
        clone.gen = this.gen;
        clone.bestScore = this.score;

        return clone;
    }


    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //fot Genetic algorithm
    calculateFitness() {
        this.fitness = 1 + this.score * this.score + this.lifespan / 20.0;
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    crossover(parent2) {

        var child = new Spout();
        child.brain = this.brain.crossover(parent2.brain);
        child.brain.generateNetwork();
        return child;
    }


}