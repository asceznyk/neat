var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var winwidth = 300;
var winheight = 512;

var FlappyNEAT = new NEAT(100);
FlappyNEAT.initpopulation(Bird);

var NearestPillar = function(Cols) {
  var nearestx = winwidth+10;
  var nearestpil;
  for(let s = 0; s < Cols.length; s++) {
    if(Cols[s].x < nearestx) {
      if(Cols[s].x > 10) {
        nearestx = Cols[s].x;
        nearestpil = Cols[s];
        nearestpil.id = s;
      }
    }
  }
  return nearestpil;
}

var flappybird = function(g) {

  var points = document.getElementById("score");
  var generations = document.getElementById("generations");

  if(g >= 50) {
    return false;
  }

  var Pillars = [new Column(300, 0), new Column(460, 0)];
  var clearindexs, collision, fallhndle;

  var PoleAnimation = setInterval(function(){
    for(let Pil = 0; Pil < Pillars.length; Pil++) {
      Pillars[Pil].animatepole();
      if(Pillars[Pil].x <= -20) {
        Pillars[Pil].x = 300;
        Pillars[Pil].holey = calcol(Pillars[Pil].length, Pillars[Pil].holelength);
      }
    }

    let NPil = NearestPillar(Pillars);

    collision = FlappyNEAT.operatepopulation('collide', [NPil], true, 'dead');
    fallhndle = FlappyNEAT.operatepopulation('fall', [], true, 'dead');

    if(collision.bool == true || fallhndle.bool == true) {
      if(collision.bool == true && fallhndle.bool == false) {
        clearindexs = collision.ids;
      } else if (collision.bool == false && fallhndle.bool == true) {
        clearindexs = fallhndle.ids;
      }
      for(let cl = 0; cl < clearindexs.length; cl++) {
        FlappyNEAT.population[clearindexs[cl]].erase();
        FlappyNEAT.population[clearindexs[cl]].dead = true;
      }
    }

    var aliveindices = FlappyNEAT.checkpopulation('dead');

    if(aliveindices.length <= 0) {
      for(let r = 0; r < Pillars.length; r++) {
        Pillars[r].erase();
      }
      clearInterval(PoleAnimation);
      FlappyNEAT.calcfitness();
      FlappyNEAT.generation('poolsingle');
      generations.innerHTML = 'Generations: '+FlappyNEAT.generations;
      flappybird(g+1);
    } else if (aliveindices.length > 0) {
      for(let t = 0; t < aliveindices.length; t++) {
        let rx = aliveindices[t];
        if(NPil.x-FlappyNEAT.population[rx].x <= 300) {
          if(NPil.x == FlappyNEAT.population[rx].x+1) {
            FlappyNEAT.population[rx].points += 1;
            FlappyNEAT.population[rx].score += 1000;
            points.innerHTML = 'Score: '+FlappyNEAT.population[rx].points;
          }
          FlappyNEAT.population[rx].selectmove(NPil);
          FlappyNEAT.population[rx].score++;
        }
      }
    }
  }, 2);
}

flappybird(0)
