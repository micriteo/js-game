import * as PIXI from "pixi.js";
import Victor from "victor";
import Player from "./player.js";
//import Matter from "matter-js";

// Create a Pixi Application
//Give dimensions of the canvas
const canvasSize = 256;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

//Create a player
let player = new Player({ app });

const enemyRadius = 16;
const enemySpeed = 2;
const enemy = new PIXI.Graphics();
let r = randomSpawnPoint();
enemy.position.set(r.x, r.y);
enemy.beginFill(0xff0000, 1);
enemy.drawCircle(0, 0, enemyRadius);
enemy.endFill();
app.stage.addChild(enemy);

//Function that moves the square according to mouse position
app.ticker.add((delta) => {
  player.update();
  //Moving the enemy
  //let e = new Victor(enemy.position.x, enemy.position.y); //vector for enemy position
  //let s = new Victor(square.position.x, square.position.y); //vector for player position
  //if enemy is close to player, it resets to a random spawnPoint
  // if (e.distance(s) < squareWidth / 2) {
  //  let r = randomSpawnPoint();
  //  enemy.position.set(r.x, r.y);
  //  return;
  //}
  // let d = s.subtract(e); //vector for distance between enemy and player
  // let v = d.normalize().multiplyScalar(enemySpeed); //vector for direction of movement
  // converts the direction vector to a unit vector
  // enemy.position.set(enemy.position.x + v.x, enemy.position.y + v.y);
});

//Function that spawns randomly new enemies
function randomSpawnPoint() {
  let edge = Math.floor(Math.random() * 4); //random integer between 0 and 3
  let spawnPoint = new Victor(0, 0); //vector representing the spawn point
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
