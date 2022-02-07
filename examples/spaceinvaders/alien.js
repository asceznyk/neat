class Bomb {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 10;
	}

	draw() {
		ctx.fillStyle = '#fff';
		ctx.fillRect(this.x, this.y, 2, this.size);
	}

	erase() {
	  ctx.clearRect(this.x, this.y, this.size, this.size);
	}

	constrain() {
		if(this.x <= 0) {
			this.x = 0;
		} else if (this.x >= (winwidth-60))  {
			this.x = winwidth-60;
		}
	}

	animateshot(right) {
		this.erase();
		this.y += 20;
		if(right) {
			this.x += 30;
		} else {
			this.x -= 30;
		}
		this.draw();
		//this.constrain();
	}
}

class Alien {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
		this.firstx = x;
		this.firsty = y;
		this.tright = true;
		this.id = id;
    this.size = 40;
    this.health = 100;
		this.bright = false;
		this.img = new Image();
		this.imgaliens = ['images/alien1.png','images/alien2.png','images/alien3.png','images/alien4.png'];
		this.img.src = this.imgaliens[Math.floor(Math.random()*this.imgaliens.length)];
		this.dead = false;
  }

  draw() {
    ctx.beginPath();
	  ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
  }

  erase() {
	  ctx.clearRect(this.x, this.y, this.size, this.size);
	}

  shoot(bombs) {
    bombs.push(new Bomb(this.x+30, this.y))
  }

  collide(missile) {
		if(missile.x >= this.x && missile.x <= (this.x+this.size)) {
	    if(missile.y <= (this.y+this.size)) {
				this.health -= 50;
				if(this.health <= 0) {
					this.dead = true;
				}
				return true;
	    }
		}
  }

	ghostmiss(bombs) {
		for(let i = 0; i < bombs.length; i++) {
			if(bombs[i].y >= winheight) {
				bombs.splice(i, 1)
			}
		}
	}

  animatealien() {
    this.erase();
		if(this.tright == true) {
			this.x += 10;
			if(this.x >= this.firstx+60) {
				this.tright = false;
			}
		} else {
			this.x -= 10
			if(this.x <= this.firstx) {
				this.tright = true;
			}
		}
		this.draw();
	}
}
