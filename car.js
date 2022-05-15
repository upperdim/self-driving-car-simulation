class Car {
    constructor(x, y, width, height, controlType, maxSpeed) {
        this.x = x;
        this.y = y;
        this.width  = width;
        this.height = height;

        this.speed = 0;
        this.maxSpeed = maxSpeed;
        this.accel = 0.2;
        this.friction = 0.05;

        // Coord sys: Unit circle rotated 90 degrees counter-clockwise
        this.angle = 0;

        this.damaged = false;

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; ++i) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; ++i) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
    } 

    // Create points for representing the corners of the car
    #createPolygon() {
        const points = [];

        // Distance from middle to any point (any point from the middle is the same distance)
        const rad = Math.hypot(this.width, this.height) / 2;
    
        // tangent of this angle = width / height, find it
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });

        return points;
    }

    #move() {
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

        const flipSteerDirection = this.speed < 0 ? -1 : 1; // fix flipped reverse steering direction

        // Left
        if (this.controls.left) {
            this.angle += 0.03 * flipSteerDirection;
        }

        // Right
        if (this.controls.right) {
            this.angle -= 0.03 * flipSteerDirection;
        }

        // Update speed
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    // Draw to a canvas context
    draw(ctx, color) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color;
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 0; i < this.polygon.length; ++i) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }

}
