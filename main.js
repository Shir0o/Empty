var mainState = {
    
    //Load the assets
    preload: function() { 
        
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        
        game.load.image('mountains-back', 'assets/mountains-back.png');
        game.load.image('mountains-mid1', 'assets/mountains-mid1.png');
        game.load.image('mountains-mid2', 'assets/mountains-mid2.png');
        
        game.load.image('sun', 'assets/sun.png');
        game.load.image('moon', 'assets/moon.png');
        
    },
    
    //Set up the game
    create: function() {
        
        this.dayLength = 5000;
        this.shading = false;
        this.sunSprite = false;
        this.moonSprite = false;
        
        /*+++++Background setup+++++*/
        game.stage.backgroundColor = '#000';
        
        //Enables Arcade Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        let bgBitMap = this.game.add.bitmapData(this.game.width, this.game.height);
        
        bgBitMap.ctx.rect(0, 0, this.game.width, this.game.height);
        bgBitMap.ctx.fillStyle = '#b2ddc8';
        bgBitMap.ctx.fill();
        
        this.backgroundSprite = this.game.add.sprite(0, 0, bgBitMap);
        
        //Add the sun sprite and moon sprite
        this.sunSprite = this.game.add.sprite(50, -250, 'sun');
        this.moonSprite = this.game.add.sprite(this.game.width - (this.game.width / 4), this.game.height + 500, 'moon');
        
        //Add the three layers of the background
        this.mountainsBack = this.game.add.tileSprite(0, 
            this.game.height - this.game.cache.getImage('mountains-back').height, 
            this.game.width, 
            this.game.cache.getImage('mountains-back').height, 
            'mountains-back'
        );
        
        this.mountainsMid1 = this.game.add.tileSprite(0, 
            this.game.height - this.game.cache.getImage('mountains-mid1').height, 
            this.game.width, 
            this.game.cache.getImage('mountains-mid1').height, 
            'mountains-mid1'
        );
        
        this.mountainsMid2 = this.game.add.tileSprite(0, 
            this.game.height - this.game.cache.getImage('mountains-mid2').height, 
            this.game.width, 
            this.game.cache.getImage('mountains-mid2').height, 
            'mountains-mid2'
        );
        
        let backgroundSprites = [
            {sprite: this.backgroundSprite, from: 0x1f2a27, to: 0xB2DDC8},
            {sprite: this.mountainsBack, from: 0x2f403b, to: 0x96CCBB},
            {sprite: this.mountainsMid1, from: 0x283632, to: 0x8BBCAC},
            {sprite: this.mountainsMid2, from: 0x202b28, to: 0x82AD9D}
        ];
        
        this.initShading(backgroundSprites);
        this.initSun(this.sunSprite);
        this.initMoon(this.moonSprite);
        
        /*+++++Game setup+++++*/
        //Display the bird at 683x 298y
        this.bird = game.add.sprite(683, 298, 'bird');
        
        //Add physics to the bird
        game.physics.arcade.enable(this.bird);
        
        //The bird falls at a speed of 1000 downward constantly
        this.bird.body.gravity.y = 1000;
        
        //When space is hit, call the 'jump' function
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        //Create an empty group
        this.pipes = game.add.group();
        
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        
        //Move the anchor to left and downward
        this.bird.anchor.setTo(-0.2,0.5);
        
    },
    
    //Allow the bird to jump
    jump: function() {
        
        if(this.bird.alive == false)
            return;
        
        //Adds 350 upward speed
        this.bird.body.velocity.y = -350;
        
        //Create an animation on the bird
        var animation = game.add.tween(this.bird);
        
        //Change the angle of the bird to -200 degrees in 100 miliseconds
        animation.to({angle: -20}, 100);
        
        //Start the animation
        animation.start();
        
    },
    
    //Restart the game by calling the mainState
    restartGame: function() {
        
        game.state.start('main');
        
    },
    
    //Add a pipe at position x y
    addOnePipe: function(x, y) {
        
        var pipe = game.add.sprite(x, y, 'pipe');
        
        //Add the pipes to the group made in the 'create' function
        this.pipes.add(pipe);
        
        //Enable physics on the pipe
        game.physics.arcade.enable(pipe);
        
        //The pipe moves left at a speed of 200
        pipe.body.velocity.x = -200; 
        
        //Kill the pipe when it is outside the screen
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
        
    },
    
    addRowOfPipes: function() {
        
        //Randomlly pick a number between 1 and 5
        var hole = Math.floor(Math.random() * 5) + 1;
        
        //Add 6 pipes with two holes at 'hole' and 'hole' + 1
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(2048, i * 60 + 100);
        
        this.score += 1;
        this.labelScore.text = this.score;  
        
    },
    
    hitPipe: function() {
        
        //Do nothing if the bird falls down
        if(this.bird.alive == false)
            return;
        
        this.bird.alive = false;
        
        //Prevent new pipes from appearing
        game.time.events.remove(this.timer);
        
        //Stop the movement of all pipes
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0; 
        }, this);
        
    },
    
    //Pass the sun sprite in
    initSun: function(sprite) {
        
        this.sunSprite = sprite;
        this.sunset(sprite);
        
    },
    
    //Pass the moon sprite in
    initMoon: function(sprite) {
        
        this.moonSprite = sprite;
        this.moonrise(sprite);
        
    },
    
    //Pass both sprites in as an object
    initShading: function(sprites) {
        
        this.shading = sprites;
        
    },
    
    sunrise: function(sprite) {
        
        //Set the x position of the sun to 1/4 width of the game from the right
        sprite.x = this.game.width - (this.game.width / 4);
        
        //Animate the sun y postition all the way off the top of the screen
        this.sunTween = this.game.add.tween(sprite).to( { y: -250 }, this.dayLength, null, true);
        
        //Check if the sun finishes rising and call the 'sunset' function
        this.sunTween.onComplete.add(this.sunset, this);
 
        if(this.shading){
            this.shading.forEach((sprite) => {
                this.tweenTint(sprite.sprite, sprite.from, sprite.to, this.dayLength);
            });
        }
        
    },
    
    //Reverse of the 'sunrise' function
    sunset: function(sprite) {
        
        sprite.x = 50;
 
        this.sunTween = this.game.add.tween(sprite).to( { y: this.game.world.height }, this.dayLength, null, true);
        this.sunTween.onComplete.add(this.sunrise, this);
 
        if(this.shading){
            this.shading.forEach((sprite) => {
                this.tweenTint(sprite.sprite, sprite.to, sprite.from, this.dayLength);
            });
        }
        
    },
    
    moonrise: function(sprite) {
        
        sprite.x = this.game.width - (this.game.width / 4);
 
        this.moonTween = this.game.add.tween(sprite).to( { y: -350 }, this.dayLength, null, true);
        this.moonTween.onComplete.add(this.moonset, this);
        
    },
    
    moonset: function(sprite) {
        
        sprite.x = 50;
 
        this.moonTween = this.game.add.tween(sprite).to( { y: this.game.world.height }, this.dayLength, null, true);
        this.moonTween.onComplete.add(this.moonrise, this);
        
    },
    
    //Handle the animation of the sprite from one color to another throughout the day
    tweenTint: function(spriteToTween, startColor, endColor, duration) {
        
        let colorBlend = {step: 0};
        
        this.game.add.tween(colorBlend).to({step: 100}, duration, Phaser.Easing.Default, false)
            .onUpdateCallback(() => {
                spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
            })
            .start()
        
    },
    
    //Game logic
    update: function() {
        
        //If the bird is above or below the screen, call the 'restartGame' function
        if (this.bird.y < 80 || this.bird.y > 600)
            this.restartGame();
        
        game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);
        
        if (this.bird.angle < 20)
            this.bird.angle += 1;
        
        this.mountainsBack.tilePosition.x -= 0.05;
        this.mountainsMid1.tilePosition.x -= 0.3;
        this.mountainsMid2.tilePosition.x -= 0.75;
        
    }
    
};

//Initialize 2048px by 894px game
var game = new Phaser.Game(2048, 894);

//Add the mainState
game.state.add('main', mainState); 

//Start the mainState
game.state.start('main');