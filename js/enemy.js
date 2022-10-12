import * as PIXI from "pixi.js";
import Victor from "victor";
export default class enemy {
  constructor({ app, player }) {
    this.app = app;
    this.player = player;

    const radius = 16;
    this.speed = 1.5;
    this.enemy = new PIXI.Graphics();
    let r = this.randomSpawnPoint();
    this.enemy.position.set(r.x, r.y);
    this.enemy.beginFill(0xff0000, 1);
    this.enemy.drawCircle(0, 0, radius);
    this.enemy.endFill();
    app.stage.addChild(this.enemy);
  }

  get position() {
    return this.enemy.position;
  }
  //Method that spawns randomly new enemies
  randomSpawnPoint() {
    let edge = Math.floor(Math.random() * 4); //random integer between 0 and 3
    let spawnPoint = new Victor(0, 0); //vector representing the spawn point
    let canvasSize = this.app.screen.width;
    switch (edge) {
      case 0: //top
        spawnPoint.x = canvasSize * Math.random();
        break;
      case 1: //right
        spawnPoint.x = canvasSize;
        spawnPoint.y = canvasSize * Math.random();
        break;
      case 2: //bottom
        spawnPoint.x = canvasSize * Math.random();
        spawnPoint.y = canvasSize;
        break;
      default:
        spawnPoint.x = 0;
        spawnPoint.y = canvasSize * Math.random();
        break;
    }
    return spawnPoint;
  }

  update(delta) {
    //Moving the enemy
    let e = new Victor(this.enemy.position.x, this.enemy.position.y); //vector for enemy position
    let s = new Victor(this.player.position.x, this.player.position.y); //vector for player position
    //if enemy is close to player, it resets to a random spawnPoint
    if (e.distance(s) < this.player.width / 2) {
      this.attackPlayer();
      return;
    }
    let d = s.subtract(e); //vector for distance between enemy and player
    let v = d.normalize().multiplyScalar(this.speed * delta); //vector for direction of movement
    //converts the direction vector to a unit vector
    this.enemy.position.set(
      this.enemy.position.x + v.x,
      this.enemy.position.y + v.y
    );
  }

  kill() {
    this.app.stage.removeChild(this.enemy);
    clearInterval(this.interval);
  }

  //Function that attacks the player
  //If the player gets hit the healthBar will change the color and the health of the Player will decrease until he dies
  attackPlayer() {
    if (this.attacking) return;
    this.attacking = true;
    this.interval = setInterval(() => this.player.attack(), 500);
  }
}
