import * as PIXI from "pixi.js";
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
  }

  update() {
    const cursorPosition = this.app.renderer.plugins.interaction.mouse.global;
    let angle =
      Math.atan2(
        cursorPosition.y - this.player.position.y,
        cursorPosition.x - this.player.position.x
      ) +
      Math.PI / 2;
    this.player.rotation = angle;
  }
}
