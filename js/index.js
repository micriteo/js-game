import * as PIXI from "pixi.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import Spawner from "./spawner.js";
//import Matter from "matter-js";

// Create a Pixi Application
//Give dimensions of the canvas
const canvasSize = 1024;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

initGame();

async function initGame() {
  try {
    console.log("loading assets...");
    await loadAssets();
    console.log("loaded..");
    //Create a player
    let player = new Player({ app });
    let eSpawner = new Spawner({
      app,
      create: () => new Enemy({ app, player }),
    }); //spawns enemies
    // pass an object that has the create method as a property
    // the create method is a function that creates a new enemy

    let gameStartScene = createScene("Click to Start"); //create a scene for the start of the game
    let gameOverScene = createScene("Game Over"); //create a scene for the game over
    app.gameStarted = false;

    //Function that moves the square according to mouse position
    //delta is the time between frames
    app.ticker.add((delta) => {
      gameOverScene.visible = player.dead;
      gameStartScene.visible = !app.gameStarted; //if the game has not started, the start scene is visible//if the game is over, the game over scene is visible
      if (app.gameStarted === false) return;
      player.update(delta);
      eSpawner.spawns.forEach((enemy) => enemy.update(delta)); //we go for all the enemies in the array and we update them
      bulletHit({
        bullets: player.shooting.bullets,
        enemies: eSpawner.spawns,
        bulletRadius: 8,
        enemyRadius: 16,
      });
    });
  } catch (error) {
    console.log(error.message);
    console.log("Load failed");
  }
}

function bulletHit({ bullets, enemies, bulletRadius, enemyRadius }) {
  bullets.forEach((bullet) => {
    enemies.forEach((enemy, index) => {
      let dx = enemy.position.x - bullet.position.x;
      let dy = enemy.position.y - bullet.position.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bulletRadius + enemyRadius) {
        enemies.splice(index, 1);
        enemy.kill();
      }
    });
  });
}

function createScene(sceneText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xff1010,
    align: "center",
  });
  text.anchor.set(0.5, 0);
  text.x = app.screen.width / 2;
  text.y = 0;
  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text);
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

function startGame() {
  app.gameStarted = true;
}

//Start the game when the user clicks on the canvas
async function loadAssets() {
  return new Promise((resolve, reject) => {
    PIXI.Loader.shared.add("assets/hero_male.json");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

document.addEventListener("click", startGame);
