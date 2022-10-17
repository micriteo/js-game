import * as PIXI from "pixi.js";
import * as PARTICLES from "pixi-particles";
import {rain} from "./emitter-configs.js";

export default class Weather{

    constructor({app}){
        this.lightningGap = {min:9000, max: 290000}; //in ms
        this.app = app;
        this.createAudio();
        this.lightning = new PIXI.Sprite(PIXI.Texture.WHITE); //creating the lightning sprite
        this.lightning.width = this.lightning.height = app.screen.width; //setting the width and height of the lightning
        this.lightning.tint = 0xffffff; //white
        this.lightning.alpha = 0.8; //opacity
        this.flash();
        //rain

        const container = new PIXI.ParticleContainer();
        container.zIndex = 2;
        app.stage.addChild(container);
        const emitter = new PARTICLES.Emitter(container,[PIXI.Loader.shared.resources["rain"].texture],rain); //    
        let elapsed = Date.now(); //time elapsed since the beginning of the game
        const update = function (){ //function that updates the rain
            requestAnimationFrame(update);
            let now = Date.now();
            emitter.update((now - elapsed) * 0.001);
            elapsed = now;
        }
        emitter.emit = true;
        update();
    }

    createAudio(){
        this.thunder = new Audio("assets/thunder.mp3");
        this.music = new Audio("assets/bleach.mp3");
        this.rain = new Audio("assets/rain.mp3");
        this.rain.volume = 0.5;
        this.music.addEventListener("ended", () => this.music.play());
        this.rain.addEventListener("timeupdate", function(){ //looping the rain sound
                if(this.currentTime > this.duration - 0.2)  //time goes up as the sound is progressing 
                {
                    this.currentTime = 0; //resetting the time
                }
        });
    
    }

    async flash()
    {
        await new Promise (res => setTimeout(res, this.lightningGap.min + ((this.lightningGap.max - this.lightningGap.min) * Math.random()))); 
        //waiting for a random time between the min and max time
        this.app.stage.addChild(this.lightning); //adding the lightning to the stage
        if(this.sound) this.thunder.play();
        await new Promise (res => setTimeout(res, 200)); //waiting for 100ms
        this.app.stage.removeChild(this.lightning); //removing the lightning
        this.flash(); //calling the function again
    }

    enableSound(){
        this.sound = true;
        this.rain.play();
        this.music.play();
    }
}
