class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width  = width;
        this.height = height;

        this.speed = 0;
        this.maxSpeed = 3;
        this.accel = 0.2;
        this.friction = 0.05;

        // Coord sys: Unit circle rotated 90 degrees counter-clockwise
        this.angle = 0;

        this.controls = new Controls();
    }

    // Draw to a canvas context
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y); // Rotation is centered at this coord
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            // We removed `this.x` and `this.y` from the beginning after adding
            // `translate()` above. Because it receives the car x, y and
            // already puts it into the position. Adding those values here
            // will offset the car by those values *again*, making it
            // appear off-position.
            - this.width  / 2,
            - this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore(); // ?
    }

    update() {
        // Forw
        if (this.controls.forward) {
            this.speed += this.accel;
        }

        // Reverse
        if (this.controls.reverse) {
            this.speed -= this.accel;
        }

        // Forw Speedcap
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        // Reverse Speedcap
        if (this.speed < - this.maxSpeed / 2) {
            this.speed = - this.maxSpeed / 2;
        }
        
        // Forw Friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        // Reverse Friction
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // Friction stop
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // Left
        if (this.controls.left) {
            this.angle += 0.03;
        }

        // Right
        if (this.controls.right) {
            this.angle -= 0.03;
        }

        // Update speed
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }
}
