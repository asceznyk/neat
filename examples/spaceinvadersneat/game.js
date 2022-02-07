var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var SpaceInvadersNEAT = new NEAT(200);
SpaceInvadersNEAT.initpopulation(Ship);

var initaliens = function() {
  var aliens = [];
  var id = 0;
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 6; x++) {
      aliens.push(new Alien(x*80, y*60, id))
      id++;
    }
  }
  return aliens;
}

var nearestbomb = function(ship, bombs) {
  var nearestdists = [];
  var nearestdist = winmaxdist;
  for(let j = 0; j < bombs.length; j++) {
    if(bombs[j].y < winheight-60) {
      let dist = Math.sqrt((Math.pow((ship.x-bombs[j].x),2)+Math.pow((ship.y-bombs[j].y),2)));
      if(dist <= nearestdist) {
        nearestdist = dist;
        nearestdists.unshift(dist);
      }
    }
  }

  if(nearestdists.length >= 5) {
    nearestdists.splice(5);
  }
  return nearestdists;
}

var nearestalien = function(ship, aliens) {
  var nearestdists = [];
  var nearestdist = 6000;
  for(let i = 0; i < aliens.length; i++) {
    let dist = Math.sqrt((Math.pow((ship.x-aliens[i].x),2)+Math.pow((ship.y-aliens[i].y),2)));
    if(dist <= nearestdist) {
      nearestdist = dist;
      nearestdists.unshift(dist);
    }
  }
  if(nearestdists.length >= 5) {
    nearestdists.splice(5);
    nearestdists.forEach(function(entry){
      entry = entry/winmaxdist
    })
  }
  return nearestdists;
}

var spaceinvaders = function(ship, sindex) {
  var endgen = false;

  if(sindex >= SpaceInvadersNEAT.maxpop) {
    SpaceInvadersNEAT.calcfitness();
    SpaceInvadersNEAT.generation('poolcrossover');
    endgen = true;
  }

  var aliens = initaliens();
  var time = 2;
  var missiles = [];
  var bombs = [];

  if(!endgen) {
    var gameanimation = setInterval(function() {

      var nbombdists = nearestbomb(ship, bombs);
      var naliendists = nearestalien(ship, aliens);
      var input = []

      for(let elem = 0; elem < nbombdists.length; elem++) {
        nbombdists[elem] /= winmaxdist;
      }

      if(nbombdists.length <= 0) {
        input = [0.99, 0.99, 0.99, 0.99, 0.99, (ship.x/winwidth), (ship.y/winheight)];
      } else if(nbombdists.length < 5 && nbombdists.length > 0) {
        let elselength = 5-nbombdists.length;
        let elsearr = [];
        for(let x = 0; x < elselength; x++) {
          elsearr.push(0.99)
        }
        nbombdists.push(...elsearr);
        nbombdists.push(...[(ship.x/winwidth), (ship.y/winheight)]);
        input = nbombdists;
      } else {
        nbombdists.push(...[(ship.x/winwidth), (ship.y/winheight)]);
        input = nbombdists;
      }

      ship.makeaction(input, missiles)

      for(var k = 0; k < missiles.length; k++) {
        missiles[k].animateshot();
      }
      ship.ghostmiss(missiles);

      for(var i = 0; i < aliens.length; i++) {
        if(Math.random() < 0.01) {
          aliens[i].shoot(bombs);
        }

        for(var l = 0; l < missiles.length; l++) {
          if(aliens[i].collide(missiles[l])) {
            missiles[l].erase();
            missiles.splice(l, 1);
            if(aliens[i].dead) {
              ship.score += 30;
              aliens[i].erase();
              aliens.splice(i, 1);
            }
          }
        }
      }

      aliens.forEach(function(entry){
        entry.ghostmiss(bombs);
        entry.animatealien();
      });

      for (var m = 0; m < bombs.length; m++) {
        if(m % 2 == 0) {
          bombs[m].animateshot(true);
        } else {
          bombs[m].animateshot(false);
        }
        if(ship.collide(bombs[m])) {
          bombs[m].erase();
          bombs.splice(m, 1);
          if(ship.dead) {
            ship.erase();
            aliens.forEach(function(entry){
              entry.erase();
            })
            missiles.forEach(function(entry){
              entry.erase();
            })
            clearInterval(gameanimation);
          }
        }
      }

      if(ship.dead) {
        bombs.forEach(function(entry){
          entry.erase();
        });
        sindex++;
        spaceinvaders(SpaceInvadersNEAT.population[sindex], sindex);
      }
    }, time);
  } else {
    spaceinvaders(SpaceInvadersNEAT.population[0], 0);
  }

}

spaceinvaders(SpaceInvadersNEAT.population[0], 0)
