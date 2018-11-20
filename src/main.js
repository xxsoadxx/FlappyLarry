import 'phaser';

class LoadScene extends Phaser.Scene  
{
    constructor ()
    {
        super('LoadScene');
    }

    preload ()
    {
        this.load.on('progress', (value) => {
            console.log(value*100 + ' %');
        });

        this.load.on('complete', () => {
            this.scene.start('GameScene');
        });

        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        this.load.image('background-day', 'assets/sprites/background-day.png');
        this.load.image('background-night', 'assets/sprites/background-night.png');
        this.load.image('base', 'assets/sprites/base.png');
        this.load.image('blue-bird-downflap', 'assets/sprites/bluebird-downflap.png');
        this.load.image('blue-bird-midflap', 'assets/sprites/bluebird-midflap.png');
        this.load.image('blue-bird-upflap', 'assets/sprites/bluebird-upflap.png');
        this.load.image('yellow-bird-downflap', 'assets/sprites/yellowbird-downflap.png');
        this.load.image('yellow-bird-midflap', 'assets/sprites/yellowbird-midflap.png');
        this.load.image('yellow-bird-upflap', 'assets/sprites/yellowbird-upflap.png');
        this.load.image('red-bird-downflap', 'assets/sprites/redbird-downflap.png');
        this.load.image('red-bird-midflap', 'assets/sprites/redbird-midflap.png');
        this.load.image('red-bird-upflap', 'assets/sprites/redbird-upflap.png');   
        this.load.image('intro', 'assets/sprites/message.png');
        this.load.image('gameover', 'assets/sprites/scoreboard.png');
        this.load.image('pipe', 'assets/sprites/pipe-green.png');
        this.load.image('replay', 'assets/sprites/replay.png');
        this.load.image('medal-bronze', 'assets/sprites/medal_bronze.png');
        this.load.image('medal-silver', 'assets/sprites/medal_silver.png');
        this.load.image('medal-gold', 'assets/sprites/medal_gold.png');
        this.load.image('medal-platinum', 'assets/sprites/medal_platinum.png');
    }

    create ()
    {
        window.addEventListener('resize', this.resize);
        this.resize();

        let birdRandom = Phaser.Math.Between(0, 2);

        if(birdRandom == 0)
        {
            this.anims.create({
                key: 'fly',
                frames: [
                    { key: 'blue-bird-downflap' },
                    { key: 'blue-bird-midflap' },
                    { key: 'blue-bird-upflap' },
                ],
                frameRate: 8,
                repeat: -1
            });
        }
        else if(birdRandom == 1)
        {
            this.anims.create({
                key: 'fly',
                frames: [
                    { key: 'yellow-bird-downflap' },
                    { key: 'yellow-bird-midflap' },
                    { key: 'yellow-bird-upflap' },
                ],
                frameRate: 8,
                repeat: -1
            });
        }
        else 
        {
            this.anims.create({
                key: 'fly',
                frames: [
                    { key: 'red-bird-downflap' },
                    { key: 'red-bird-midflap' },
                    { key: 'red-bird-upflap' },
                ],
                frameRate: 8,
                repeat: -1
            });
        }

        anims = this.anims;
    }

    resize (){
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;
    
        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
}

class GameScene extends Phaser.Scene
{
    constructor () 
    {
        super('GameScene');
    }

    create () 
    {
        score = 0;
        gameStarted = false;
        finishedGame = false;

        let bgRandom = Phaser.Math.Between(0, 1);
        let bgDayOrNight;
        switch (bgRandom){
            case 0:
                bgDayOrNight = 'background-day';
                break;
            case 1:
                bgDayOrNight = 'background-night';
                break;    
        };
    
        bg = this.add.tileSprite(0, 0, 300, 512, bgDayOrNight);
        bg.setOrigin(0, 0);
        bg.setDepth(0);
        bg.setInteractive();

        base = this.add.tileSprite(0, game.config.height, 600, 50, 'base');
        base.setDepth(3);
        this.physics.add.existing(base, false);
        base.body.allowGravity = false;
        base.body.setCollideWorldBounds(true);

        bird = this.physics.add.sprite(75, 300).play('fly');
        bird.body.height = 24;
        bird.setOrigin(0.5, 0.7);
        bird.body.allowGravity = false;
        bird.body.setCollideWorldBounds(true);
        bird.setDepth(2);
        this.physics.add.collider(base, bird, this.gameOver);

        pipes = this.physics.add.group();
        pipes.setDepth(1);
        this.physics.add.overlap(pipes, bird, this.gameOver);

        zonesScore = this.physics.add.group();
        this.physics.add.overlap(bird, zonesScore, this.incrementScore);

        intro = this.add.image(game.config.width/2, game.config.height/2, 'intro');
        intro.setDepth(4);

        bg.on('pointerdown', () => {
            gameStarted ? this.jump() : this.startGame();
        });

        timedEvent = this.time.addEvent ({ delay: 1500, callback: this.addOnePipe, callbackScope: this, loop: true });

        scoreText = this.add.bitmapText(game.config.width/2, 20, 'font', score, 40);
        scoreText.setDepth(4);
    }

    update ()
    {
        if(!finishedGame)
        {
            bg.tilePositionX += 0.25;
            base.tilePositionX += 2.5;          
        }
        
        if(!finishedGame && gameStarted)
        {   
            pipes.getChildren().forEach((pipe) => {
                pipe.x -= 2.5;
            });

            zonesScore.getChildren().forEach((zoneScore) => {
                zoneScore.x -= 2.5;
            });

            if(bird.angle < 20 && gameStarted)
            {
                bird.angle += 1;
            }
        }
    }

    addOnePipe ()
    {
        if(gameStarted && !finishedGame)
        {
            let gap = 120;
            let randomHeightTop = Phaser.Math.Between(50, 312);
            let calculHeightBottom = game.config.height - base.height - randomHeightTop - gap;
            let pBottom = this.add.tileSprite(400, 462, 52, calculHeightBottom, 'pipe').setOrigin(0.5, 1);
            this.physics.add.existing(pBottom, false);
            pipes.add(pBottom);
            pBottom.body.setImmovable();
            pBottom.body.setAllowGravity(false);
            //pBottom.setOrigin(0.5, 1);
            
            let pTop = this.add.tileSprite(400, randomHeightTop, 52, 320, 'pipe').setFlipY(true).setOrigin(0.5, 1);
            this.physics.add.existing(pTop, false);
            pipes.add(pTop);
            pTop.body.setImmovable();
            pTop.body.setAllowGravity(false);
            //pTop.setOrigin(0.5, 1);
            
            let zoneScore = this.add.zone(400 + pBottom.width/2, 0).setSize(1, game.config.height - base.height);
            zonesScore.add(zoneScore);
            zoneScore.setDepth(0);
            this.physics.world.enable(zoneScore);
            zoneScore.body.setAllowGravity(false);
            zoneScore.body.moves = false;  
        }   
    }

    jump ()
    {
        if(!finishedGame)
        {
            bird.setVelocityY(-250);
            bird.angle = -20;  
        }     
    }

    incrementScore (bird, zoneScore)
    {
        score++;
        scoreText.text = score;
        zoneScore.destroy();
    }

    startGame ()
    {
        gameStarted = true;
        intro.visible = false;
        bird.body.allowGravity = true;
    }

    gameOver ()
    {
        if(!finishedGame)
        {
            finishedGame = true;
            scoreText.visible = false;
            bird.anims.pause();
            game.scene.start('GameOverScene');
        }    
    }
}

class GameOverScene extends Phaser.Scene
{
    constructor ()
    {
        super('GameOverScene');
    }

    create ()
    {
        gameover = this.add.image(game.config.width/2, game.config.height/2, 'gameover');
        gameover.setDepth(4);

        replay = this.add.image(game.config.width/2, 3*game.config.height/4, 'replay').setInteractive();
        replay.setDepth(4);
        replay.setInteractive = true;

        replay.on('pointerdown', () => {
            this.scene.stop();
            game.scene.stop('GameScene');
            this.scene.launch('GameScene');
        });
        currentScoreText = this.add.bitmapText(3*game.config.width/4 + 5, game.config.height/2 - 35, 'font', score, 20);
        currentScoreText.setDepth(4);

        bestScoreText = this.add.bitmapText(3*game.config.width/4 + 5, game.config.height/2 +5, 'font', bestScore, 20);
        bestScoreText.setDepth(4);
        bestScoreText.text = bestScore;
        this.getBestScore();

        let medalColor = this.getMedal();
        if(medalColor != '')
        {
            this.add.image(80, 251, medalColor).setDepth(5);
        }
    }

    getBestScore ()
    {
        if(score >= bestScore)
        {
            bestScore = score;
        }
    }

    getMedal ()
    {
        let medalColor = '';
        
        if(10 <= score && score < 20){
            medalColor = 'medal-bronze';
        }
        else if(20 <= score && score < 30){
            medalColor = 'medal-silver';
        }
        else if(30 <= score && score < 50){
            medalColor = 'medal-gold';
        }
        else if(score > 50){
            medalColor = 'medal-platinum';
        }

        return medalColor;
    }
}

var config = {
    type: Phaser.AUTO,
    width: 288,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: true
        }
    },
    scene: [LoadScene, GameScene, GameOverScene]
};

var game = new Phaser.Game(config);
var score, bestScore = 0, bg, base, bird, anims;
var scoreText, bestScoreText, currentScoreText, medal;
var gameStarted, finishedGame;
var timedEvent;
var pipes, zonesScore;
var gameover, intro;
var replay;