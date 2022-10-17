import * as PIXI from "pixi.js";

export default class Shooting {
  constructor({ app, player }) {
    this.app = app;
    this.player = player;
    this.bulletSpeed = 4;
    this.bullets = []; //array of bullets
    this.bulletRadius = 100; //radius of the bullet
    this.maxBullets = 5;//maximum number of bullets
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

    const bullet = new PIXI.Sprite(PIXI.Loader.shared.resources["bullet"].texture); //creates a new bullet
    bullet.anchor.set(0.5); //sets the anchor point to the center of the bullet
    bullet.scale.set(0.1); //scales the bullet
    bullet.position.set(this.player.position.x, this.player.position.y);
    bullet.rotation = this.player.rotation / 2  + 1 //rotates the bullet to face the player

    let angle = this.player.rotation - Math.PI / 2; //angle of the bullet
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

  update(delta) {
    this.bullets.forEach((b) =>
      b.position.set(
        b.position.x + b.velocity.x * delta,
        b.position.y + b.velocity.y * delta
      )
    ); //updates the position of the bullets
  }
}
