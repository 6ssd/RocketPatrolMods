class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

        //load sounds
        this.load.audio('sfx_explosion', './assets/explosion.wav');
        this.load.audio('sfx_rocket', './assets/rocket_fire.wav');
        this.load.audio('sfx_select', './assets/select.wav');
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 1280, 480, 'starfield').setOrigin(0, 0);

        //green UI background
        this.add.rectangle(0, borderUIsize + borderPadding, game.config.width, borderUIsize * 2, 0x00FF00).setOrigin(0, 0);

        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUIsize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUIsize, game.config.width, borderUIsize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUIsize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUIsize, 0, borderUIsize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        //add rocket: player 1
        this.p1Rocket = new P1Rocket(this, game.config.width/4, game.config.height - borderUIsize - borderPadding, 'rocket', 0, 0).setOrigin(0.5, 0);
        this.p2Rocket = new P2Rocket(this, game.config.width*3/4, game.config.height - borderUIsize - borderPadding, 'rocket', 0, 0).setOrigin(0.5, 0);

        //add spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUIsize*6, borderUIsize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUIsize*3, borderUIsize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUIsize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);            //Player 1 left
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);            //Player 1 right
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);            //Player 1 fire

        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);            //Player 2 left
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);            //Player 2 right
        keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);            //Player 2 fire


        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //display score;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUIsize + borderPadding, borderUIsize + borderPadding*2, this.p1Rocket.numScore, scoreConfig);
        this.scoreRight = this.add.text(game.config.width - borderUIsize - borderPadding - scoreConfig.fixedWidth, borderUIsize + borderPadding*2, this.p2Rocket.numScore, scoreConfig);

        //GAME OVER flag
        this.gameOver = false;
        
        //Timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            
            //check who wins
            //Player 1 Wins
            if(this.p1Rocket.numScore > this.p2Rocket.numScore)        
            {
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'Player 1 Wins!', scoreConfig).setOrigin(0.5);
            }
            //Player 2 Wins
            else if(this.p1Rocket.numScore < this.p2Rocket.numScore)    
            {
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'Player 2 Wins!', scoreConfig).setOrigin(0.5);
            }
            //Players Tie
            else if(this.p1Rocket.numScore == this.p2Rocket.numScore)                                              
            {
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'Tie!', scoreConfig).setOrigin(0.5);
            }

            this.gameOver = true;
        }, null, this);
    }

    update(){
        //check for restart key
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        //check for menu key
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //update background scrolling
        this.starfield.tilePositionX -= 4;
        
        if(!this.gameOver)
        {
            //update rockets
            this.p1Rocket.update();
            this.p2Rocket.update();
            
            //update spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        //check collisions player 1
        if(this.checkCollision(this.p1Rocket, this.ship03))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.p1Rocket, this.ship03, "left");
        }
        if(this.checkCollision(this.p1Rocket, this.ship02))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.p1Rocket, this.ship02, "left");
        }
        if(this.checkCollision(this.p1Rocket, this.ship01))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.p1Rocket, this.ship01, "left");
        }

        //check collisions player 2
        if(this.checkCollision(this.p2Rocket, this.ship03))
        {
            this.p2Rocket.reset();
            this.shipExplode(this.p2Rocket, this.ship03, "right");
        }
        if(this.checkCollision(this.p2Rocket, this.ship02))
        {
            this.p2Rocket.reset();
            this.shipExplode(this.p2Rocket, this.ship02, "right");
        }
        if(this.checkCollision(this.p2Rocket, this.ship01))
        {
            this.p2Rocket.reset();
            this.shipExplode(this.p2Rocket, this.ship01, "right");
        }
    }

    checkCollision(rocket, ship)
    {
        //simple AABB checking
        if( rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        }
        else {
            return false;
        }
    }

    shipExplode(rocket,ship,direction)
    {
        //temp hide ship
        ship.alpha = 0;

        //create explosion
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    //callback after animation completes
            ship.reset();                       //reset ship
            ship.alpha = 1;                     //ship visible
            boom.destroy();                     //remove explosion sprite
        });
        
        if(direction == "left")
        {
            //add to score
            rocket.numScore += ship.points;
            this.scoreLeft.text = rocket.numScore;
        }
        if(direction == "right")
        {
            //add to score
            rocket.numScore += ship.points;
            this.scoreRight.text = rocket.numScore;
        }

        //play sound
        this.sound.play('sfx_explosion');
    }
}