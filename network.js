class NeuralNetwork {
    // neuronCounts: int array containing number of neurons on each layer
    constructor(neuronCounts) {
        this.levels = [];

        for (let i = 0; i < neuronCounts.length - 1; ++i) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0]); // feedForward for first level

        // remaining levels
        for (let i = 1; i < network.levels.length; ++i) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }

        return outputs;
    }

    static mutate(network, amount=1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; ++i) {
                level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
            }

            for (let i = 0; i < level.weights.length; ++i) {
                for (let j = 0; j < level.weights[i].length; ++j) {
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
                }
            }
        });
    }
}

// 2 layers of neurons of the neural network
class Level {
    // inputCount:  number of backward layer of neurons in the current level
    // outputCount: number of forward  layer of neurons in the current level
    constructor(inputCount, outputCount) {
        this.inputs  = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases  = new Array(outputCount);
        
        this.weights = [];
        
        // Each input neuron is connected to all output neurons
        for (let i = 0; i < inputCount; ++i) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; ++i) {
            for (let j = 0; j < level.outputs.length; ++j) {
                level.weights[i][j] = Math.random() * 2 - 1; // -1, 0, 1
            }
        }

        for (let i = 0; i < level.biases.length; ++i) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {
        // givenInputs will come from the sensors, assign them to the inputs of the level
        for (let i = 0; i < level.inputs.length; ++i) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; ++i) {
            let sum = 0;

            for (let j = 0; j < level.inputs.length; ++j) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}
