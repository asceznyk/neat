//NEAT libarary

class NEAT {
  constructor(maxpop) {
    this.generations = 0;
    this.population = [];
    this.maxpop = maxpop;
    this.species = [];
  }

  initpopulation(object) {
    for(let a = 0; a < this.maxpop; a++) {
      this.population[a] = new object();
    }
  }

  operatepopulation(operator, parameters, returnbool, checkee) {
    var indexs = [];
    var runst;
    var rbool = false;
    for(let d = 0; d < this.maxpop; d++) {
      if(this.population[d][checkee] == false) {
        if(returnbool == true) {
          runst = this.population[d][operator](parameters[0]);
          if(runst == true) {
            indexs.push(d);
            rbool = true;
          }
        } else {
          this.population[d][operator](parameters[0]);
        }
      }
    }
    return {'bool':rbool, 'ids':indexs};
  }

  checkpopulation(checker) {
    var indexes = []
    for(var e = 0; e < this.maxpop; e++) {
      if(this.population[e][checker] != true) {
        indexes.push(e);
      }
    }
    return indexes;
  }

  sort(done, indexobj) {
    if (done == true) {
      return false;
    }
    var iter = 0;
    done = true;
    while (iter < this.species[indexobj].length-1) {
      if(this.species[indexobj][iter+1].fitness > this.species[indexobj][iter].fitness) {
        let temp = this.species[indexobj][iter+1];
        this.species[indexobj][iter+1] = this.species[indexobj][iter];
        this.species[indexobj][iter] = temp;
        done = false;
      }
      iter++;
    }
    this.sort(done, indexobj)
  }

  remove(value) {
     return this.population.filter(function(ele){
         return ele != value;
     });
  }

  calcfitness() {
    var sum = 0;

    for(let x = 0; x < this.maxpop; x++) {
      this.population[x].score = Math.pow(this.population[x].score, 2);
    }

    for(let f = 0; f < this.maxpop; f++) {
      sum += this.population[f].score;
    }

    for(let g = 0; g < this.maxpop; g++) {
      this.population[g].fitness = this.population[g].score/sum;
    }

  }

  poolsingle() {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r -= this.population[index].fitness;
      index++;
    }
    index--;
    return index;
  }

  speciateselection(threshold) {
    for(let i = 1; i < this.maxpop; i++) {
      let specbool = true;
      for(let j = 0; j < this.species.length; j++) {
        if(this.species[j][0].fitness-this.population[i].fitness <= threshold && this.species[j][0].fitness-this.population[i].fitness >= -threshold) {
          this.species[j].push(this.population[i].copy())
          specbool = false;
        }
      }
      if(specbool == true) {
        this.species.push([this.population[i].copy()])
      }
    }
  }

  generation(mode) {
    if(mode == 'speciate') {
      this.speciateselection(0.1);
      this.species = [].concat.apply([],this.species);
    } else if(mode == 'poolsingle') {
      for(let l = 0; l < this.maxpop; l++) {
        this.species.push(this.population[this.poolsingle()].copy());
      }
    } else if(mode == 'poolcrossover') {
      for(let l = 0; l < this.maxpop; l++) {
        let parent1 = this.population[this.poolsingle()].copy();
        let parent2 = this.population[this.poolsingle()].copy();
        let child = parent1.crossover(parent2);
        child.model.mutate(mutate);
        this.species.push(child.copy());
      }
    }
    this.generations++;
    this.population = this.species;
    this.species = [];
    console.log('generation:'+this.generations);
  }
}
