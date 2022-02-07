var winwidth = 500;
var winheight = 600;
var winmaxdist = Math.sqrt(Math.pow(winwidth-0, 2)+Math.pow(winheight-0, 2));

function map_range(val, flow, fhigh, tlow, thigh) {
	return (val/(fhigh - flow)) * (thigh - tlow);
}

function randomGaussian()  {
  do {
    var x1 = Math.random()*2-1;
    var x2 = Math.random()*2-1;
    var w = x1 * x1 + x2 * x2;
  } while (w >= 1);
  w = Math.sqrt((-2 * Math.log(w))/w);
  return x1 * w;
}

function mutate(x) {
  if (Math.random() < 0.04) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

function arrayremove(arr, value) {
   return arr.filter(function(ele){
       return ele != value;
   });
}

class Missile {
	constructor(x, y, id) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.size = 10;
	}

	draw() {
		ctx.fillStyle = '#ffff00';
		ctx.fillRect(this.x, this.y, 2, this.size)
	}

	erase() {
	  ctx.clearRect(this.x, this.y, this.size, this.size);
	}

	animateshot() {
		this.erase();
		this.y -= 30;
		this.draw();
	}
}

class Ship {
  constructor(model) {
    this.x = winwidth/2;
    this.y = winheight-60;
		this.id = 0;
    this.size = 40;
	  this.fitness = 0;
	  this.score = 0;
	  this.dead = false;
		this.health = 400;
	  this.vision = [];
		this.img = new Image();
		this.img.src = 'images/ship.png';

    if(model instanceof NeuralNetwork) {
	    this.model = model.copy();
	  } else {
	    this.model = new NeuralNetwork();
			this.model.layer({type:'input', units:7});
			this.model.layer({type:'regression', units:7});
			this.model.layer({type:'dense', units:3, activation:sigmoid});
	  }
  }

  copy() {
		return new Ship(this.model);
	}

	draw() {
	  ctx.beginPath();
	  ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
	}

	erase() {
	  ctx.clearRect(this.x, this.y, this.size, this.size);
	}

	shoot(missiles) {
		missiles.push(new Missile(this.x+30, this.y, this.id));
	}

	collide(bomb) {
		if(bomb.x >= this.x && bomb.x <= (this.x+this.size)) {
	    if(bomb.y >= (this.y+this.size)) {
				this.health -= 50;
				if(this.health == 0) {
					this.dead = true;
				}
				return true;
	    }
		}
  }

	ghostmiss(missiles) {
		for(let i = 0; i < missiles.length; i++) {
			if(missiles[i].y <= 0) {
				missiles[i].erase();
				missiles.splice(i, 1)
			}
		}
	}

	constrain() {
		if(this.x <= 0) {
			this.x = 0;
		} else if (this.x >= (winwidth-60))  {
			this.x = winwidth-60;
		}
	}

	crossover(partner) {
		var offspring = this;
		if(partner.fitness >= this.fitness) {
			if(partner.model.layers.length != this.model.layers.length) {
				console.log('alert! cols are not equal')
			}
			for(let l = 1; l < this.model.layers.length; l++) {
				for(let dr = 0; dr < this.model.weights[l].rows; dr++) {
					for(let dc = 0; c < this.model.weights[l].cols; dc++) {
						if(dc % 2 == 0) {
							offspring.model.weights[l].data[dr][dc] = parter.model.weights[l].data[dr][dc];
						}
					}
				}
			}
		}
		return offspring;
	}

	makeaction(inputs, missiles) {
		this.erase();
		var outputs = this.model.predict(inputs).outputs;
		var action = outputs.indexOf(Math.max.apply(null, outputs));
		//console.log(inputs, outputs)

		if(action == 0) {
			this.x += 12;
		} else if(action == 1) {
			this.x -= 12
		} else if(action == 2) {
			this.shoot(missiles);
		}

		this.constrain();
		this.draw();
	}
}
