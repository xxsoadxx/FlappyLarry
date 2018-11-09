    var config = {
        type: Phaser.AUTO,
        width: 288,
        height: 512,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 600 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);
    var base;
    var bird;
    var cursors;
    var intro;
    var gameover;
    var gameStarted;
    var finishedGame;
    var anims;
    var pipes;
    var timedEvent;
    var score;
    var labelScore;
    var zonesScore;

    function preload ()
    {
        this.load.image('0', 'assets/sprites/0.png');
        this.load.image('1', 'assets/sprites/1.png');
        this.load.image('2', 'assets/sprites/2.png');
        this.load.image('3', 'assets/sprites/3.png');
        this.load.image('4', 'assets/sprites/4.png');
        this.load.image('5', 'assets/sprites/5.png');
        this.load.image('6', 'assets/sprites/6.png');
        this.load.image('7', 'assets/sprites/7.png');
        this.load.image('8', 'assets/sprites/8.png');
        this.load.image('9', 'assets/sprites/9.png');
        this.load.image('background-day', 'assets/sprites/background-day.png');
        this.load.image('background-night', 'assets/sprites/background-night.png');
        this.load.image('base', 'assets/sprites/base.png');
        this.load.image('blue-bird-downflap', 'assets/sprites/bluebird-downflap.png');
        this.load.image('blue-bird-midflap', 'assets/sprites/bluebird-midflap.png');
        this.load.image('blue-bird-upflap', 'assets/sprites/bluebird-upflap.png');
        this.load.image('intro', 'assets/sprites/message.png');
        this.load.image('gameover', 'assets/sprites/gameover.png')
        this.load.image('pipe', 'assets/sprites/pipe-green.png');
    }

    function create ()
    {
        let bg = this.add.sprite(0, 0, 'background-day');
        bg.setOrigin(0, 0);
        bg.setDepth(0);

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
        anims = this.anims;
        
        base = this.add.tileSprite(0, game.config.height, 600, 50, 'base');
        base.setDepth(3);
        this.physics.add.existing(base, false);
        base.body.allowGravity = false;
        base.body.setCollideWorldBounds(true);

        bird = this.physics.add.sprite(100, 300, 'bird').play('fly');
        bird.body.height = 24;
        bird.setOrigin(-0.2, 0.5);
        bird.body.allowGravity = false;
        bird.body.setCollideWorldBounds(true);
        bird.setDepth(2);

        this.physics.add.collider(base, bird, finishGame);

        pipes = this.physics.add.group();
        pipes.setDepth(1);

        this.physics.add.overlap(pipes, bird, finishGame);

        zonesScore = this.physics.add.group();
        this.physics.add.overlap(bird, zonesScore, incrementScore);

        timedEvent = this.time.addEvent({ delay: 1500, callback: addOnePipe, callbackScope: this, loop: true});
        
        intro = this.add.image(game.config.width/2, game.config.height/2, 'intro');
        intro.setDepth(4);
        gameover = this.add.image(game.config.width/2, game.config.height/2, 'gameover');
        gameover.visible = false;
        gameover.setDepth(4);

        score = 0;
        labelScore = this.add.text(20, 20, "0", 
            { font: "30px Arial", fill: "#ffffff" });

        cursors = this.input.keyboard.createCursorKeys();

        this.input.on("pointerdown", function() {
            if (!gameStarted && !finishedGame) {
              startGame();
            }
          });
    }

    function update ()
    {
        if(!finishedGame)
        {
            base.tilePositionX += 2.5;
        }
        
        if(gameStarted && !finishedGame)
        {
            pipes.getChildren().forEach(function(pipe){
                pipe.x -= 2.5;
            });

            zonesScore.getChildren().forEach(function(zoneScore){
                zoneScore.x -= 2.5;
            });
            
            if(cursors.space.isDown)
            {
                jump();
            }

            if (bird.angle < 20)
            {
                bird.angle += 1; 
            }
        }
    }   

    function startGame()
    {
        gameStarted = true;
        finishedGame = false;
        intro.visible = false;
        bird.body.allowGravity = true;
    }

    function finishGame() 
    {
        gameStarted = false;
        finishedGame = true;
        gameover.visible = true;
        bird.alive = false;
        anims.remove('fly');
        base.tilePositionX = 0;
        timedEvent.remove(false);
    }

    function jump()
    {
        bird.setVelocityY(-250);
        bird.angle = -20;
        
    }

    function addOnePipe(){
        if(gameStarted && !finishedGame){
            var gap = 100;
            var randomHeightTop = Phaser.Math.Between(50, 312);
            var calculHeightBottom = game.config.height - base.height - randomHeightTop - gap;

            pBottom = this.add.tileSprite(400, 462, 52, calculHeightBottom, 'pipe');
            this.physics.add.existing(pBottom, false);
            pipes.add(pBottom);  
            pBottom.body.setImmovable();         
            pBottom.body.setAllowGravity(false);
            pBottom.setOrigin(0.5, 1);

            pTop = this.add.tileSprite(400, randomHeightTop, 52, 320, 'pipe').setFlipY(true).setOrigin(0.5, 1);
            this.physics.add.existing(pTop, false);
            pipes.add(pTop);
            pTop.body.setImmovable();
            pTop.body.setAllowGravity(false);
            pTop.setOrigin(0.5, 1);

            zoneScore = this.add.zone(400 + pBottom.width/2, 0).setSize(1, game.config.height - base.height);
            zonesScore.add(zoneScore);
            zoneScore.setDepth(0);
            this.physics.world.enable(zoneScore);
            zoneScore.body.setAllowGravity(false);
            zoneScore.body.moves = false;            
        }
    }

    function incrementScore(bird, zoneScore){
        score++;
        labelScore.setText(score);
        labelScore.setDepth(4);
        zoneScore.destroy();
    }