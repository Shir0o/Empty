class DayCycle {
    
    constructor(game, dayLength){
        
        this.game = game;
        this.dayLength = dayLength;
        this.shading = false;
        this.sunSprite = false;
        this.moonSprite = false;
        
    }
    
    //Pass the sun sprite in
    initSun(sprite) {
        
        this.sunSprite = sprite;
        this.sunset(sprite);
        
    }
    
    //Pass the moon sprite in
    initMoon(sprite) {
        
        this.moonSprite = sprite;
        this.moonrise(sprite);
        
    }
    
    //Pass both sprites in as an object
    initShading(sprites) {
        
        this.shading = sprites;
        
    }
    
    sunrise(sprite) {
        
        //Set the x position of the sun to 1/4 width of the game from the right
        sprite.position.x = this.game.width - (this.game.width / 4);
        
        //Animate the sun y postition all the way off the top of the screen
        this.sunTween = this.game.add.tween(sprite).to( { y: -250 }, this.dayLength, null, true);
        
        //Check if the sun finishes rising and call the 'sunset' function
        this.sunTween.onComplete.add(this.sunset, this);
 
        if(this.shading){
            this.shading.forEach((sprite) => {
                this.tweenTint(sprite.sprite, sprite.from, sprite.to, this.dayLength);
            });
        }
        
    }
    
    //Reverse of the 'sunrise' function
    sunset(sprite) {
        
        sprite.position.x = 50;
 
        this.sunTween = this.game.add.tween(sprite).to( { y: this.game.world.height }, this.dayLength, null, true);
        this.sunTween.onComplete.add(this.sunrise, this);
 
        if(this.shading){
            this.shading.forEach((sprite) => {
                this.tweenTint(sprite.sprite, sprite.to, sprite.from, this.dayLength);
            });
        }
        
    }
    
    moonrise(sprite) {
        
        sprite.position.x = this.game.width - (this.game.width / 4);
 
        this.moonTween = this.game.add.tween(sprite).to( { y: -350 }, this.dayLength, null, true);
        this.moonTween.onComplete.add(this.moonset, this);
        
    }
    
    moonset(sprite) {
        
        sprite.position.x = 50;
 
        this.moonTween = this.game.add.tween(sprite).to( { y: this.game.world.height }, this.dayLength, null, true);
        this.moonTween.onComplete.add(this.moonrise, this);
        
    }
    
    //Handle the animation of the sprite from one color to another throughout the day
    tweenTint(spriteTotween, startColor, endColor, duration) {
        
        let colorBlend = {step: 0};
        
        this.game.add.tween(colorBlend).to({step: 100}, duration, Phaser.Easing.Default, false)
            .onUpdateCallback(() => {
                spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
            })
            .start()
        
    }
    
}