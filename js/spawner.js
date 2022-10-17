import GameState from "./game-state";

export default class Spawner {
  constructor({ app, create }) {
    this.app = app;
    const spawnInterval = 500; //in ms
    this.maxSpawns = 20;
    this.create = create;
    this.spawns = []; // array of spawned objects
    setInterval(() => this.spawn(), spawnInterval); //spawn new objects every spawnInterval
  }

  //Method that spawns new objects
  spawn() {
    if (this.app.gameState !== GameState.RUNNING) return;
    if (this.spawns.length < this.maxSpawns) {
      //if the number of spawned objects is less than the maximum number of spawns
      let spawn = this.create(); //create a new object
      this.spawns.push(spawn); //add the new object to the array of spawned objects
    }
  }
}
