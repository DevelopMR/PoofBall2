class Bubble {
    constructor(parent) {
        this.parent = parent;
        this.weight = 10 + Math.random() * 10;
        this.x = 30 + (canvas.width - 30) * Math.random();
        this.y = 30 + 60 * Math.random();

        this.gravity = .005; // ??

        this.dragScaler = .005;
        this.xVel = 0;
        this.yVel = 0;

        this.color = this.parent.color;

        this.width = 30;
        this.radius = this.width / 2;
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

    // do they need to move?
    // lots of cycle wasted if we are testing for AI
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

        // border rollover ? **or bounce?**  MOVE to collision
        if ((this.x > canvas.width) || (this.x < 0)) { this.parent.dead = true }
        //if (this.x < 0) { this.parent.dead = true }

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