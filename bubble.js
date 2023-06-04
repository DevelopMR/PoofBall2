class Bubble {
    constructor(parent) {
        this.parent = parent;
        this.weight = 10 + Math.random() * 10;
        this.x = 30 + (canvas.width - 30) * Math.random();
        this.y = 30 + 240 * Math.random();

        this.gravity = .005; // ??

        this.dragScaler = .005;
        this.xVel = 0;
        this.yVel = 0;

        this.color = this.parent.color;

        this.width = 30;
        this.radius = this.width / 2;

        this.bumpCount = 0;
        this.bumpMax = 8; // maximum number of puffs a bubble can withstand
    }



    show() {
        //push();
        colorMode(HSB, 100);
        var strokeColor = color(hue(this.color), int(saturation(this.color) * .8), int(brightness(this.color)), 55);
        stroke(strokeColor);
        //fill(this.color);
        var fieldColor = color(hue(this.color), int(saturation(this.color) * .8), int(brightness(this.color)), 10);
        fill(fieldColor);
        ellipse(this.x, this.y, this.width, this.width);
        colorMode(RGB, 255);
        //pop();
    }


    bump(xBump, yBump) {
        this.xVel -= xBump;
        this.yVel -= yBump;

        this.bumpCount++;
        if (this.bumpCount >= this.bumpMax) {
            this.parent.dead = true;
        }
    }


    update() {


        if (this.xVel > 0) {
            this.xVel -= this.dragScaler * this.xVel * this.xVel;
        }
        else {
            this.xVel += this.dragScaler * this.xVel * this.xVel;
        }

        if (this.yVel > 0) {
            this.yVel -= this.dragScaler * this.yVel * this.yVel;
        }
        else {
            this.yVel += this.dragScaler * this.yVel * this.yVel;
        }
        this.yVel += this.gravity;


        this.x += this.xVel;
        this.y += this.yVel;

        // border 
        if ((this.x > canvas.width) || (this.x < 0)) {


            if ((this.y > 200) && (this.y < 400)) {
                // side score!
                this.parent.thruGoal();
            }
            else {
                this.parent.dead = true
            }
        }

        if (this.y > canvas.height) { this.parent.dead = true }

        if (this.y < 0) {

            if ((this.x > 400) && (this.x < 600)) {
                // score!!
                this.parent.thruGoal();
            }
            else {
                this.parent.dead = true;
            }
        }

    }



}