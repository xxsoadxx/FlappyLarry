class GameScene extends Phaser.Scene
{
    constructor () 
    {
        super('GameScene');
    }

    create () 
    {
        this.nextPow = 5
        this.level = 1
        this.score = {
            pts: 0,
            textObject: this.add.bitmapText(this.game.config.width/2, 20, 'font', '0', 40)
        };
        this.score.textObject.setDepth(4);
        this.gameStarted = false;
        this.finishedGame = false;

        //let bgRandom = Phaser.Math.Between(0, 1);
        //let bgDayOrNight = 'background-day';

        /*
        switch (bgRandom){
            case 0:
                bgDayOrNight = 'background-day';
                break;
            case 1:
                bgDayOrNight = 'background-night';
                break;    
        };*/
        this.bgNight = this.add.tileSprite(0, 0, 300, 512, 'background-night');
        this.bgNight.setOrigin(0, 0);
        this.bgNight.setDepth(0);
        this.bgNight.setInteractive();
        this.bgNight.visible = false;

        this.bg = this.add.tileSprite(0, 0, 300, 512, 'background-day');
        this.bg.setOrigin(0, 0);
        this.bg.setDepth(0);
        this.bg.setInteractive();
        this.bg.visible = true;
            
        this.base = this.add.tileSprite(0, this.game.config.height, 600, 50, 'base');
        this.base.setDepth(3);
        this.physics.add.existing(this.base, false);
        this.base.body.allowGravity = false;
        this.base.body.setCollideWorldBounds(true);

        this.music = this.sound.add('music');
        
        this.bird = this.physics.add.sprite(75, 300).play('clapWings');
        this.bird.body.height = 24;
        this.bird.setOrigin(0.5, 0.7);
        this.bird.body.allowGravity = false;
        this.bird.body.setCollideWorldBounds(true);
        this.bird.setDepth(2);
        this.physics.add.collider(this.base, this.bird, this.gameOver, null, this);

        this.pipes = this.physics.add.group();
        this.pipes.setDepth(1);
        this.physics.add.overlap(this.pipes, this.bird, this.gameOver, null, this);

        this.powerUps = this.physics.add.group();
        this.powerUps.setDepth(1);
        this.physics.add.overlap(this.powerUps, this.bird, this.eatpowerUP, null, this);

        this.zonesScore = this.physics.add.group();
        this.physics.add.overlap(this.bird, this.zonesScore, this.incrementScore, null, this);

        this.title = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2, 0, 'title')
        this.physics.add.existing(this.title)
        this.title.body.setCollideWorldBounds(true)
        this.title.body.allowGravity = true
        this.title.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 0, this.cameras.main.worldView.x + this.cameras.main.width, this.cameras.main.worldView.y + this.cameras.main.height / 2))

        /*this.intro = this.add.image(this.game.config.width/2, this.game.config.height/2, 'intro');
        this.intro.setDepth(4);*/

        this.bg.on('pointerdown', () => {
            this.gameStarted ? this.jump() : this.startGame();
        });
        this.bgNight.on('pointerdown', () => {
            this.gameStarted ? this.jump() : this.startGame();
        });

        this.time.addEvent ({ delay: 1500, callback: this.addOnePipe, callbackScope: this, loop: true });
        this.time.addEvent ({ delay: 5000, callback: this.deletePipes, callbackScope: this, loop: true });            
        
        this.powSound = this.sound.add('intro');
        

    }

    update ()
    {
        if(!this.finishedGame)
        {
            if(this.level == 1){
                this.bg.tilePositionX += 0.25;
                this.base.tilePositionX += 2.5;        
            } else if(this.level == 2){
                this.bgNight.tilePositionX += 0.3;
                this.base.tilePositionX += 3.0;        
            }
        }
        
        if(!this.finishedGame && this.gameStarted)
        {   
            if(this.level == 1){
                this.pipes.getChildren().forEach((pipe) => {
                    pipe.x -= 2.5;
                });

                this.zonesScore.getChildren().forEach((zoneScore) => {
                    zoneScore.x -= 2.5;
                });

                this.powerUps.getChildren().forEach((pows) => {
                    pows.x -= 2.5;
                });
            } else if(this.level == 2){
                this.pipes.getChildren().forEach((pipe) => {
                    pipe.x -= 3;
                });

                this.zonesScore.getChildren().forEach((zoneScore) => {
                    zoneScore.x -= 3;
                });

                this.powerUps.getChildren().forEach((pows) => {
                    pows.x -= 3;
                });
            }
            if(this.bird.angle < 20 && this.gameStarted)
            {
                this.bird.angle += 1;
            }

           
        }

     
    }

    addOnePipe ()
    {
        if(this.gameStarted && !this.finishedGame)
        {
            let gap = 120;
            let randomHeightTop = Phaser.Math.Between(50, 312);
            let calculHeightBottom = this.game.config.height - this.base.height - randomHeightTop - gap;
            let pBottom = this.add.tileSprite(400, 462, 52, calculHeightBottom, 'pipe').setOrigin(0.5, 1);
            this.physics.add.existing(pBottom, false);
            this.pipes.add(pBottom);
            pBottom.body.setImmovable();
            pBottom.body.setAllowGravity(false);
            
            let pTop = this.add.tileSprite(400, randomHeightTop, 52, 320, 'pipe').setFlipY(true).setOrigin(0.5, 1);
            this.physics.add.existing(pTop, false);
            this.pipes.add(pTop);
            pTop.body.setImmovable();
            pTop.body.setAllowGravity(false);
            
            let zoneScore = this.add.zone(400 + pBottom.width/2, 0).setSize(1, (this.game.config.height - this.base.height)*2);
            this.zonesScore.add(zoneScore);
            zoneScore.setDepth(0);
            this.physics.world.enable(zoneScore);
            zoneScore.body.setAllowGravity(false);
            zoneScore.body.moves = false;  
            this.counter ++

            if(this.counter == this.nextPow){
                this.time.addEvent({ delay: 500, callback: this.addOnePW, callbackScope: this, loop: false }); 
                this.counter = 0
                this.nextPow = Phaser.Math.Between(4, 10);
            }
        }   
    }

    deletePipes ()
    {
        if(this.gameStarted && !this.finishedGame)
        {
            this.pipes.getChildren().forEach((pipe) => {
                if(pipe.x < -pipe.width)
                {
                    pipe.destroy();
                }
            });
        }
    }

    jump ()
    {
        if(!this.finishedGame)
        {
            this.bird.setVelocityY(-250);
            this.bird.angle = -20;  
        }     
    }

    incrementScore (bird, zoneScore)
    {
        this.score.pts++;
        this.score.textObject.setText(('' + this.score.pts));
        zoneScore.destroy();
    }

    startGame ()
    {
        this.music.play({loop:true});
        this.gameStarted = true;
        this.title.visible = false;
        this.bird.body.allowGravity = true;
        this.counter = 0
        this.time.addEvent ({ delay: 41000, callback: this.startLvl2, callbackScope: this, loop: false }); 

        
        this.time.addEvent ({ delay: 5000, callback: this.deletePWs, callbackScope: this, loop: true });   
    }
    startLvl2 (){
        console.log("acaaaaaaa")
        if(this.gameStarted && !this.finishedGame){
            this.level = 2
            this.bg.visible = false;
            this.bgNight.visible = true;
        }
    }
    gameOver ()
    {
        if(!this.finishedGame)
        {
            //this.level = 1
            //this.finishedGame = true;
            //this.score.textObject.visible = false;
            //this.bird.anims.pause();
            //this.registry.set('score', this.score);
            //this.game.scene.start('GameOverScene');
            //this.music.pause()
        }    
    }

    addOnePW ()
    {

        if(this.gameStarted && !this.finishedGame)
        {
            console.log("polloooo");
            let gap = 120;
            let randomHeightTop = Phaser.Math.Between(50, 412);
            //let calculHeightBottom = this.game.config.height - this.base.height - randomHeightTop - gap;
            let powerUp = this.add.tileSprite(400, randomHeightTop, 64, 60, 'power-up');
            this.physics.add.existing(powerUp, false);
            this.powerUps.add(powerUp);
            powerUp.body.setImmovable();
            powerUp.body.setAllowGravity(false);
        }   
    }
    deletePWs(){
        if(this.gameStarted && !this.finishedGame)
        {
            this.powerUps.getChildren().forEach((pow) => {
                if(pow.x < -pow.pow)
                {
                    pow.destroy();
                }
            });
        }
    }
    eatpowerUP(bird, pow){
        this.powSound.play()
        this.score.pts+= 3;
        this.score.textObject.setText(('' + this.score.pts));
        pow.destroy();
    }
}

export default GameScene;
