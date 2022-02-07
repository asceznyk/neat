var imgbird = new Image();
imgbird.src = 'images/bird.png';

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
  if (Math.random() < 0.09) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Bird {
	constructor(model) {
	  this.x = 10;
	  this.y = winheight/2;
	  this.size = 20;
	  this.fitness = 0;
	  this.score = 0;
	  this.dead = false;
	  this.vision = [];
	  this.gravity = 0.7;
	  this.velocity = 0;
	  this.lift = 12;
	  this.points = 0;

	  if(model instanceof NeuralNetwork) {
	    this.model = model.copy();
			this.model.mutate(mutate);
	  } else {
	    this.model = new NeuralNetwork();
			this.model.layer({type:'input', units:5});
			this.model.layer({type:'dense', units:10, activation:sigmoid});
			this.model.layer({type:'dense', units:8, activation:sigmoid});
			this.model.layer({type:'dense', units:2, activation:sigmoid});
	  }
	}

	copy() {
		return new Bird(this.model);
	}

	draw() {
	  ctx.beginPath();
	  ctx.drawImage(imgbird, this.x, this.y, this.size, this.size);
	}

	erase() {
	  ctx.clearRect(this.x, this.y, this.size, this.size);
	}

	render() {
	  this.erase();
	  this.velocity += this.gravity;
	  this.y += this.velocity;
	  this.draw();
	}

	collide(Pillar) {
	  if(Pillar.x-this.x <= this.size) {
	    if(this.x <= (Pillar.x+Pillar.width)) {
	      if(this.y <= Pillar.holey || this.y >= (Pillar.holey+Pillar.holelength)) {
	        return true;
	      }
	    }
	  }
	}

	selectmove(NPil) {
	  let vis = [];
	  vis[0] = map_range(NPil.x, this.x, winwidth, 0, 1);
	  vis[1] = map_range(NPil.holey, 0, winheight, 0, 1);
	  vis[2] = map_range(NPil.holey+NPil.holelength, 0, winheight, 0, 1);
	  vis[3] = map_range(this.y, 0, winheight, 0, 1);
	  vis[4] = map_range(this.velocity, -5, 5, 0, 1);
	  let action = this.model.predict(vis).outputs;
	  if(action[1] > action[0]) {
	    this.animatebird('flap');
	  } else {
	    this.animatebird();
	  }
	}

	fall() {
	  if(this.y >= winheight || this.y <= 0) {
	    return true;
	  }
	}

	animatebird(dir) {
	  this.erase();
	  if(dir == 'flap') {
	    this.velocity -= this.lift;
	  }
	  this.render();
	}
}
