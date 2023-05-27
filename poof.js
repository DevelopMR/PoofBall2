class Poof {
    constructor(parent) {
        this.parent = parent;
        this.speed = 5;
        this.x = parent.x;
        this.y = canvas.height - parent.size;
        this.size = parent.size;

        this.power = 3; // thrust when poof hits bubble

        this.ModScaler = 3 / canvas.height;
        this.arcStart = 1.15 * PI;
        this.arcEnd = 1.85 * PI;
        this.sizeMod;
        this.halfSizeMod;
        this.hit = false;
    }


    show() {
        colorMode(HSB, 100);
        var scaleMod = 1 + this.ModScaler * (canvas.height - this.y);
        this.sizeMod = this.size * scaleMod;
        this.halfSizeMod = this.sizeMod / 2;
        //rect(this.x - this.halfSizeMod, this.y - this.halfSizeMod, this.sizeMod, this.halfSizeMod);
        arc(this.x, this.y, this.sizeMod, this.sizeMod, this.arcStart, this.arcEnd, OPEN);

        // fill('blue');
    }

    move() {
        this.y -= this.speed; // gravity
        // drag
    }

    collision() {
        // check height
        if (this.y <= this.size) {
            this.parent.livePoof = false;
        }

        // hit bubble
        // check y position
        if ((this.parent.bubble.y + this.parent.bubble.radius >= this.y - this.halfSizeMod) && (this.parent.bubble.y <= this.y)) {

            if ((this.parent.bubble.x + this.parent.bubble.radius >= this.x - this.halfSizeMod) && (this.parent.bubble.x - this.parent.bubble.radius <= this.x + this.halfSizeMod)) {
                if (!this.hit) {
                    this.boost();
                    this.hit = true;
                    this.parent.score += 50;
                }
            }
        }
    }

    boost() {
        // add thrust to bubble
        // find angle between spout and bubble
        var ang = Math.atan2((this.parent.y - this.parent.bubble.y), (this.parent.x - this.parent.bubble.x));
        // calculate thrust components
        var xThrust = this.power * Math.cos(ang) * 2;
        var yThrust = this.power * Math.sin(ang);

        //console.log("xThrust" + xThrust);
        //console.log("yThrust" + yThrust);

        // add component thrusts to bubble
        this.parent.bubble.xVel -= xThrust;
        this.parent.bubble.yVel -= yThrust;

    }

    update() {
        this.move();
        this.show();
        this.collision();
    }

}