import * as PIXI from "pixi.js";
import Shooting from "./shooting";
export default class Player {
  constructor({ app }) {
    //app refers to the PIXI application
    this.app = app;
    const playerWidth = 32;
    this.player = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.player.anchor.set(0.5); //anchor represents the reference of the sprite on the Ox and Oy scale
    this.player.position.set(app.screen.width / 2, app.screen.height / 2);
    this.player.width = this.player.height = playerWidth;
    this.player.tint = 0xea985d;

    app.stage.addChild(this.player);

    this.lastMouseButton = 0;
    //Creating shooting instance
    this.shooting = new Shooting({ app, player: this });
  }

  //Method that returns the position of the player
  get width() {
    return this.player.width;
  }

  get position() {
    return this.player.position;
  }

  //Method that returns the position of the player
  update() {
    const mouse = this.app.renderer.plugins.interaction.mouse; //mouse position
    const cursorPosition = mouse.global;
    let angle =
      Math.atan2(
        cursorPosition.y - this.player.position.y,
        cursorPosition.x - this.player.position.x
      ) +
      Math.PI / 2;
    this.player.rotation = angle;

    if (mouse.buttons !== this.lastMouseButton) {
      this.shooting.shoot = mouse.buttons !== 0;
      this.lastMouseButton = mouse.buttons;
    }
    this.shooting.update();
  }
}
