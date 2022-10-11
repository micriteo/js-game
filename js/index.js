import * as PIXI from "pixi.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import enemy from "./enemy.js";
import Spawner from "./spawner.js";
//import Matter from "matter-js";

// Create a Pixi Application
//Give dimensions of the canvas
const canvasSize = 512;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

//Create a player
let player = new Player({ app });
let eSpawner = new Spawner({ create: () => new Enemy({ app, player }) }); //spawns enemies
// pass an object that has the create method as a property
// the create method is a function that creates a new enemy

//Function that moves the square according to mouse position
app.ticker.add((delta) => {
  player.update();
  eSpawner.spawns.forEach((enemy) => enemy.update()); //we go for all the enemies in the array and we update them
});
