import * as PIXI from "pixi.js";

export default class Shooting {
  constructor({ app, player }) {
    this.app = app;
    this.player = player;
    this.bulletSpeed = 4;
    this.bullets = []; //array of bullets
    this.bulletRadius = 8;
    this.maxBullets = 3;
  }

  //Method that shoots bullets
  fire() {
    //Added this condition to limit the number of bullets
    //Otherwise they would increase indefinitely
    if (this.bullets.length >= this.maxBullets) {
      let b = this.bullets.shift(); //removes the first element of the array
      this.app.stage.removeChild(b); //removes the bullet from the stage
    }

    this.bullets.forEach((b) => this.app.stage.removeChild(b)); //removes all the bullets from the stage
    this.bullets = this.bullets.filter(
      (b) =>
        b.position.x > 0 &&
        b.position.x < this.app.screen.width &&
        b.position.y > 0 &&
        b.position.y < this.app.screen.height
    ); //removes the bullets that are out of the screen
    //filter method returns a new array with the elements that pass the test implemented by the provided function
    this.bullets.forEach((b) => this.app.stage.addChild(b)); //adds the bullets back to the stage in order to keep the numbers of bullets limited
    //otherwise they would increase indefinitely

    const bullet = new PIXI.Graphics(); //creates a new bullet
    bullet.position.set(this.player.position.x, this.player.position.y); //sets the position of the bullet to the position of the player
    bullet.beginFill(0x000000, 1);
    bullet.drawCircle(0, 0, this.bulletRadius);
    bullet.endFill();
    let angle = this.player.player.rotation - Math.PI / 2; //angle of the bullet
    bullet.velocity = new PIXI.Point(
      Math.cos(angle) * this.bulletSpeed,
      Math.sin(angle) * this.bulletSpeed
    ); //velocity of the bullet
    this.bullets.push(bullet);
    this.app.stage.addChild(bullet);
    console.log(this.bullets.length, this.app.stage.children.length);
  }

  //Method that updates the position of the bullets

  set shoot(shooting) {
    if (shooting) {
      this.fire(); //shoots a bullet
      this.interval = setInterval(() => this.fire(), 1500); //shoots a bullet every 100ms
    } else {
      clearInterval(this.interval); //stops shooting bullets
    }
  }

  update() {
    this.bullets.forEach((b) =>
      b.position.set(b.position.x + b.velocity.x, b.position.y + b.velocity.y)
    ); //updates the position of the bullets
  }
}
