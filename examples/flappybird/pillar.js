var imgpole = new Image();
imgpole.src = 'images/pole.png'

function calcol(length, holelength) {
  return Math.floor(Math.random()*(length-(holelength*2)))+holelength;
}

class Column {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = winheight;
    this.width = 20;
    this.holelength = 120;
    this.holey = calcol(this.length, this.holelength);
    this.id = 0;
  }

  erase() {
    ctx.clearRect(this.x, 0, this.width, this.length);
  }

  draw() {
    ctx.beginPath();
    ctx.drawImage(imgpole, this.x, 0, this.width, this.holey)
    ctx.drawImage(imgpole, this.x, this.holey+this.holelength, this.width, (this.length-(this.holey+this.holelength)));
  }

  animatepole() {
    this.erase();
    this.x -= 1;
    this.draw();
  }
}
