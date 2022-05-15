class Road {
    constructor(x, width, laneCount=3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left  = x - width / 2;
        this.right = x + width / 2;

        // 1m, practically infinite
        // increasing this a lot glitches out .setLineDash() etc.
        const infinity = 1000000;
        this.top    = -infinity;
        this.bottom =  infinity;
    }

    getLaneCenter(laneIndex) {
        // Prevent out of bound
        laneIndex = Math.max(laneIndex, 0);
        laneIndex = Math.min(laneIndex, this.laneCount);
        
        const laneWidth = this.width / this.laneCount;
        return (this.left) + (laneIndex * laneWidth) + (laneWidth / 2);
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // Lane strips
        for (let i = 0; i <= this.laneCount; ++i) {
            const x = lerp(this.left, this.right, i/this.laneCount); // linear interp

            if (i > 0 && i < this.laneCount) {
                ctx.setLineDash([20,20]);
            } else {
                ctx.setLineDash([]);
            }

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }
}
