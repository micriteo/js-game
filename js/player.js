import * as PIXI from "pixi.js";
import Shooting from "./shooting";
export default class Player {
  constructor({ app }) {
    //app refers to the PIXI application
    this.app = app;


    let sheet =
      PIXI.Loader.shared.resources["assets/ichigo.json"].spritesheet; //loading the spritesheet //loading the spritesheet

     sheet.x = 30;
     sheet.y = 120;

    let sheet2 =  PIXI.Loader.shared.resources["assets/shooting.json"].spritesheet; //loading the spritesheet //loading the spritesheet

      this.idle = new PIXI.AnimatedSprite(sheet.animations["idle"]);
       //creating the animation //creating the animation
      this.shoot = new PIXI.AnimatedSprite(sheet2.animations["shoot"]);
      this.shoot.animationSpeed = 0.003;


    this.player = new PIXI.AnimatedSprite(sheet.animations["idle"]); //creating the player
    this.player.animationSpeed = 0.09; //setting the animation speed
    this.player.play();


    //this.player = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.player.anchor.set(0.5); //anchor represents the reference of the sprite on the Ox and Oy scale
    this.player.position.set(app.screen.width / 2, app.screen.height / 2);
    //this.player.width = this.player.height = playerWidth;
    //this.player.tint = 0xea985d;

    app.stage.addChild(this.player);

    this.lastMouseButton = 0;
    //Creating shooting instance
    this.shooting = new Shooting({ app, player: this });
    //HEALTHBAR
    this.MAX_HEALTH = 100;
    this.health = this.MAX_HEALTH;
    const margin = 16;
    const barHeight = 8;
    this.healthBar = new PIXI.Graphics();
    this.healthBar.beginFill(0x00ff00); //green
    this.damageBar = new PIXI.Graphics();
    this.damageBar.beginFill(0xff0000); //red
    this.damageBar.initialWidth = app.screen.width - 2 * margin; //width of the healthBar
    this.damageBar.drawRect(
      margin,
      app.screen.height - barHeight - margin / 2,
      this.damageBar.initialWidth,
      barHeight
    );
    this.damageBar.endFill();
    this.damageBar.zIndex = 1;
    this.app.stage.sortableChildren = true; //enabling the sorting of the children
    this.app.stage.addChild(this.damageBar);
    this.healthBar.initialWidth = app.screen.width - 2 * margin; //width of the healthBar
    this.healthBar.drawRect(
      margin,
      app.screen.height - barHeight - margin / 2,
      this.healthBar.initialWidth,
      barHeight
    );
    this.healthBar.endFill();
    this.healthBar.zIndex = 1; //puting the healthBar on top of the player
    this.app.stage.sortableChildren = true; //enabling the sorting of the children
    this.app.stage.addChild(this.healthBar);
  }


  set scale(s) {
    this.player.scale.set(s);
  }

  get scale() {
    return this.player.scale.x;
  }

  //Method that returns the position of the player
  get width() {
    return this.player.width;
  }

  get position() {
    return this.player.position;
  }

  //Method that returns the position of the player
  update(delta) {
    if (this.health == 100) {
      this.damageBar.visible = false;
    }
    if (this.health < 100) {
      this.damageBar.visible = true;
      this.healthBar.visible = false;
    }
    if (this.dead) return;
    const mouse = this.app.renderer.plugins.interaction.mouse; //mouse position
    const cursorPosition = mouse.global;
    let angle =
      Math.atan2(
        cursorPosition.y - this.player.position.y,
        cursorPosition.x - this.player.position.x
      ) +
      Math.PI / 2;
    this.rotation = angle;
    this.player.scale.x = cursorPosition.x < this.player.position.x ? -1 : 1; //flipping the sprite

    if (mouse.buttons !== this.lastMouseButton) {

      this.player.textures = mouse.buttons === 0 ? this.idle.textures : this.shoot.textures;
      this.player.play();

      this.shooting.shoot = mouse.buttons !== 0;
      this.lastMouseButton = mouse.buttons;
    }
    this.shooting.update(delta);
  }

  //Method that updates the healthBar
  attack() {
    this.health -= 1;
    this.damageBar.width =
      (this.health / this.MAX_HEALTH) * this.damageBar.initialWidth; //updating the width of the healthBar
    if (this.health <= 0) {
      this.dead = true;
    }
  }
}
