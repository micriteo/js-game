export default class Spawner {
  constructor({ app, create }) {
    this.app = app;
    const spawnInterval = 1000; //in ms
    this.maxSpawns = 10;
    this.create = create;
    this.spawns = []; // array of spawned objects
    setInterval(() => this.spawn(), spawnInterval); //spawn new objects every spawnInterval
  }

  //Method that spawns new objects
  spawn() {
    if (this.app.gameStarted === false) return;
    if (this.spawns.length < this.maxSpawns) {
      //if the number of spawned objects is less than the maximum number of spawns
      let spawn = this.create(); //create a new object
      this.spawns.push(spawn); //add the new object to the array of spawned objects
    }
  }
}
