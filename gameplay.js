var gameScene = {
    key: 'gameScene',
    preload: preload,
    create: create,
    update: update
}

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
    scene: [gameScene]
};
var game = new Phaser.Game(config);
var bg;
var base;
var bird;
var cursors;
var intro;
var gameover;
var replay;
var gameStarted;
var finishedGame;
var anims;
var pipes;
var timedEvent;
var score;
var currentScoreText;
var bestScore = 0;
var bestScoreText;
var scoretext;
var labelScore;
var scoreSprite;
var scoreSprites;
var zonesScore;
var bronzeMedal, silverMedal, goldMedal, platinumMedal;
function preload ()
{
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
function create ()
{
    window.addEventListener('resize', resize);
    resize();

    let bgRandom = Phaser.Math.Between(0, 1);
    let bgDayOrNight;
    switch (bgRandom){
        case 0:
            bgDayOrNight = 'background-day';
            break;
        case 1:
            bgDayOrNight = 'background-night';
            break;    
    }

    bg = this.add.tileSprite(0, 0, 300, 512, bgDayOrNight);
    bg.setOrigin(0, 0);
    bg.setDepth(0);
    bg.setInteractive();

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
    
    base = this.add.tileSprite(0, game.config.height, 600, 50, 'base');
    base.setDepth(3);
    this.physics.add.existing(base, false);
    base.body.allowGravity = false;
    base.body.setCollideWorldBounds(true);

    bird = this.physics.add.sprite(100, 300).play('fly');
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

    bronzeMedal = this.add.image(80, 251, 'medal-bronze').setDepth(5);
    bronzeMedal.visible = false;
    silverMedal = this.add.image(80, 251, 'medal-silver').setDepth(5);
    silverMedal.visible = false;
    goldMedal = this.add.image(80, 251, 'medal-gold').setDepth(5);
    goldMedal.visible = false;
    platinumMedal = this.add.image(80, 251, 'medal-platinum').setDepth(5);
    platinumMedal.visible = false;

    replay = this.add.image(game.config.width/2, 3*game.config.height/4, 'replay').setInteractive();
    replay.visible = false;
    replay.setDepth(4);
    replay.setInteractive = false;
    score = 0;
    currentScoreText = this.add.bitmapText(3*game.config.width/4 + 5, game.config.height/2 - 35, 'font', score, 20);
    currentScoreText.visible = false;
    currentScoreText.setDepth(4);
    scoreText = this.add.bitmapText(game.config.width/2, 20, 'font', score, 40);
    scoreText.setDepth(4);
    bestScoreText = this.add.bitmapText(3*game.config.width/4 + 5, game.config.height/2 +5, 'font', bestScore, 20);
    bestScoreText.visible = false;
    bestScoreText.setDepth(4);
    cursors = this.input.keyboard.createCursorKeys();
    
    bg.on("pointerdown", function() {
        if (!gameStarted && !finishedGame) {
            startGame();
        }
        if (gameStarted && !finishedGame) {
            jump();
        }
      });
    replay.on("pointerdown", function(){
        if(finishedGame){
            game.scene.stop('gameScene');
            game.scene.start('gameScene');
            gameStarted = false;
            finishedGame = false;
            intro.visible = true;     
        }
    })  
}
function update ()
{
    if(!finishedGame)
    {
        bg.tilePositionX += 0.25;
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
    currentScoreText.visible = true;
    currentScoreText.text = score;
    updateBestScore();
    bestScoreText.text = bestScore;
    bestScoreText.visible = true;
    replay.visible = true;
    bird.alive = false;
    anims.remove('fly');
    base.tilePositionX = 0;
    timedEvent.remove(false);
    scoreText.visible = false;
    addMedal();
}
function jump()
{
    bird.setVelocityY(-250);
    bird.angle = -20;   
}
function addOnePipe(){
    if(gameStarted && !finishedGame){
        var gap = 120;
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
    scoreText.text = score;
    zoneScore.destroy();
}
function updateBestScore(){
    if(score >= bestScore){
        bestScore = score;
    }
}

function addMedal(){
    if(10 <= score && score < 20){
        bronzeMedal.visible = true;
    }
    else if(20 <= score && score < 30){
        silverMedal.visible = true;
    }
    else if(30 <= score && score < 50){
        goldMedal.visible = true;
    }
    else if(score > 50){
        platinumMedal.visible = true;
    }
}

function resize(){
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