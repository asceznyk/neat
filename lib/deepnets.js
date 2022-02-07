class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);

let notrans = new ActivationFunction(
  x => x,
  y => y
)


let relu = new ActivationFunction(
  x => Math.max(x, 0),
  y => Math.max(1, 0)
)

class NeuralNetwork {

  constructor(model) {
    if (model instanceof NeuralNetwork) {
      this.l = model.l;
      this.layers = model.layers.slice(0);
      this.weights = [null];
      this.biases = [null];

      for(let k = 1; k < this.layers.length; k++) {
        this.weights.push(model.weights[k].copy());
        this.biases.push(model.biases[k].copy());
      }
      this.activationfuncs = model.activationfuncs.slice(0);
    } else {
      this.l = 0;
      this.layers = [];
      this.activationfuncs = [notrans];
      this.weights = [null];
      this.biases = [null];
    }

    this.setalpha();
  }

  layer(object) {
    this.layers.push(object.units);
    if (object.type == 'dense' || object.type == 'regression') {
      let weights = new Matrix(this.layers[this.l], this.layers[this.l-1]);
      weights.randomize();
      this.weights.push(weights);
      let bias = new Matrix(this.layers[this.l], 1);
      bias.randomize();
      this.biases.push(bias);
      if(object.type == 'dense') {
        this.activationfuncs.push(object.activation);
      } else {
        this.activationfuncs.push(notrans);
      }
    }
    this.l = this.layers.length;
  }

  predict(input_array) {
    let inputs = Matrix.fromArray(input_array);
    let z;
    let layeractivations = [inputs];
    for(let layer = 1; layer < this.l; layer++) {
      z = Matrix.multiply(this.weights[layer], inputs)
      z.add(this.biases[layer]);
      z.map(this.activationfuncs[layer].func);
      inputs = z;
      layeractivations.push(inputs);
    }

    return {'outputs':z.toArray(), 'layerouts':layeractivations};
  }

  setalpha(learning_rate = 0.1) {
    this.alpha = learning_rate;
  }

  train(input_array, target_array) {
    let outputs = this.predict(input_array).outputs;
    outputs = Matrix.fromArray(outputs)
    let targets = Matrix.fromArray(target_array);
    let dlossa = Matrix.subtract(targets, outputs);
    let layerouts = this.predict(input_array).layerouts;
    let acur = outputs;

    for(let layer = this.l-1; layer > 0; layer--) {
      let dlossz = Matrix.map(acur, this.activationfuncs[layer].dfunc);
      dlossz.multiply(dlossa);
      dlossz.multiply(this.alpha);
      let aprev = layerouts[layer-1];
      let curw = this.weights[layer];
      let dlossw = Matrix.multiply(dlossz, Matrix.transpose(aprev));
      this.weights[layer].add(dlossw);
      this.biases[layer].add(dlossz);
      dlossa = Matrix.multiply(Matrix.transpose(curw), dlossz);
      acur = aprev;
    }
  }

  copy() {
    return new NeuralNetwork(this);
  }

  mutate(func) {
    for(let k = 1; k < this.layers.length; k++) {
      this.weights[k].map(func);
      this.biases[k].map(func);
    }
    this.addlayer(0.05);
    this.addneuron(0.1);
  }

  addneuron(chance) {
    var layer = Math.floor(1+Math.random()*(this.l-2));
    if(Math.random() < chance) {
      this.layers[layer] += 1;

      this.weights[layer].rows += 1;
      let addedwrow = []
      for(let e = 0; e < this.weights[layer].cols; e++) {
        addedwrow.push(Math.random()*2-1)
      }
      this.weights[layer].data.push(addedwrow);

      this.biases[layer].rows += 1;
      this.biases[layer].data.push([Math.random()*2-1]);

      this.weights[layer+1].cols += 1;
      for(let f = 0; f < this.weights[layer+1].rows; f++) {
        this.weights[layer+1].data[f].push(Math.random()*2-1);
      }
    }
  }

  addlayer(chance) {
    if(Math.random() < chance) {
      this.layers.splice(this.l-1, 0, 1);
      this.activationfuncs.splice(this.l-1, 0, notrans);
      this.l = this.layers.length;

      this.weights[this.l-2].data.splice(0, this.weights[this.l-2].rows-1);
      this.weights[this.l-2].rows = 1;

      this.biases[this.l-2].data.splice(0, this.biases[this.l-2].rows-1);
      this.biases[this.l-2].rows = 1;

      let weights = new Matrix(this.layers[this.l-1], this.layers[this.l-2]);
      weights.randomize();
      this.weights.push(weights);

      let bias = new Matrix(this.layers[this.l-1], 1);
      bias.randomize();
      this.biases.push(bias);

      return true;
    }
  }
}
