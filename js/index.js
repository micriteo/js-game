import * as PIXI from "pixi.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import Spawner from "./spawner.js";
import { enemies, textStyle, subTextStyle } from "./globals.js";
import Weather from "./weather.js";
import GameState from "./game-state.js";
//import Matter from "matter-js";

// Create a Pixi Application
//Give dimensions of the canvas
const canvasSize = 600;
const canvas = document.getElementById("mycanvas");
let scoreNumber = 0;

const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x000000,
  resolution: 2
});



const backgroundTexture = PIXI.Texture.from("assets/arena.jpg");
const backgroundSprite = new PIXI.Sprite(backgroundTexture);
backgroundSprite.width = canvasSize;
backgroundSprite.height = canvasSize;
app.stage.addChild(backgroundSprite);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

 


initGame();

async function initGame() {
  app.gameState = GameState.PREINTRO; //Set the game state to preintro
  try {
    console.log("loading assets...");
    await loadAssets();
    console.log("loaded..");
    app.weather = new Weather({ app });
    //Create a player
    let player = new Player({ app });
    let eSpawner = new Spawner({
      app,
      create: () => new Enemy({ app, player }),
    }); //spawns enemies
    // pass an object that has the create method as a property
    // the create method is a function that creates a new enemy

    let gamePreIntroScene= createScene("You Against the World", "Click to Continue"); //create a scene for the intro
    let gameStartScene = createScene("You Against the World", "Click to Start"); //create a scene for the start of the game
    let gameOverScene = createScene("You Against the World","Game Over"); //create a scene for the game over
    let screenScore = createScene("Your current score is " + scoreNumber); //create a scene for the score
    
    //Function that moves the square according to mouse position
    //delta is the time between frames
    app.ticker.add((delta) => {

      if(player.dead) app.gameState = GameState.GAMEOVER; //if the player is dead, the game state is game over

      gamePreIntroScene.visible = app.gameState === GameState.PREINTRO; //if the game state is preintro, the scene is visible
      gameStartScene.visible = app.gameState === GameState.START; //if the game has not started, the start scene is visible//if the game is over, the game over scene is visible
      gameOverScene.visible = app.gameState === GameState.GAMEOVER;
      screenScore.visible = app.gameState === GameState.RUNNING;

      switch(app.gameState) //switch case for the game state
      {
        case GameState.PREINTRO: //if the game state is preintro, the game starts
           player.scale = 4;
        break;
        case GameState.INTRO: //if the game state is intro, the game starts
          player.scale -= 0.01;
          if(player.scale <= 1) 
            app.gameState = GameState.START;
            break;
            case GameState.RUNNING:
              player.scale = 0.9;
              app.weather.enableSound();
              player.update(delta);
              eSpawner.spawns.forEach((enemy) => enemy.update(delta)); //we go for all the enemies in the array and we update them
              bulletHit({
                bullets: player.shooting.bullets,
                enemies: eSpawner.spawns,
                bulletRadius: 8,
                enemyRadius: 16,
              });
            break;
        default:
        break;
      }
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
        scoreNumber += 1;
        
      }
    });
  });
}

function createScene(sceneText, sceneSubText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText, new PIXI.TextStyle(textStyle));
  text.x = app.screen.width / 2;
  text.y = 0;
  text.anchor.set(0.5, 0);
  
 
  const subText = new PIXI.Text(sceneSubText, new PIXI.TextStyle(subTextStyle));
  subText.x = app.screen.width / 2;
  subText.y = 50;
  subText.anchor.set(0.5, 0);


  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text);
  sceneContainer.addChild(subText);
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

//Start the game when the user clicks on the canvas
async function loadAssets() {
  return new Promise((resolve, reject) => {
    enemies.forEach((e) => PIXI.Loader.shared.add(`assets/${e}.json`));
    PIXI.Loader.shared.add("bullet", "assets/bullet.png");
    PIXI.Loader.shared.add("rain", "assets/rain.png");
    PIXI.Loader.shared.add("assets/grimjow-attack.json");
    PIXI.Loader.shared.add("assets/grimjow-run.json");
    PIXI.Loader.shared.add("assets/grimjow-die.json");
    PIXI.Loader.shared.add("assets/ichigo.json");
    PIXI.Loader.shared.add("assets/shooting.json");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

function clickHandler() { //when the user clicks on the canvas, the game starts

  switch(app.gameState) //switch case for the game state
  {
    case GameState.PREINTRO:  //if the game state is preintro, the game starts
    app.gameState = GameState.INTRO;
    //music.play();
    break;
    case GameState.START:
      app.gameState = GameState.RUNNING;
      break;
      default:
      break;
  }

}



function scoreCalculating()
{
  scoreNumber++;
  const score = new PIXI.Text("Score: " + scoreNumber, new PIXI.TextStyle(textStyle));
}

document.addEventListener("click", clickHandler); 
