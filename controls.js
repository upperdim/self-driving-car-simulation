class Controls {
    constructor() {
        this.forward = false;
        this.reverse = false;
        this.right = false;
        this.left = false;
    
        this.#addKeyboardListeners(); // beginning # denotes private method
    }

    #addKeyboardListeners() {
        // Arrow function handler for the `onkeydown`event listener
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    // If we were to write a normal function,
                    // below `this` would refer to the function itself
                    // instead of the instance of the class.
                    // Therefore it matters.
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
            console.table(this);
        }
        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
            console.table(this);
        }
    }
}
