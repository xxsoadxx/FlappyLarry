    var config = {
        type: Phaser.AUTO,
        width: 288,
        height: 512,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
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
    var logo;
    var gameStarted = false;

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
        this.load.image('message', 'assets/sprites/message.png');
        this.load.spritesheet('bird', 'assets/sprites/birds.png', {frameWidth: 100, frameHeight: 100});
    }

    function create ()
    {
        let bg = this.add.sprite(0, 0, 'background-day');
        bg.setOrigin(0, 0);


        logo = this.add.image(288/2, 512/2, 'message');
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
        bird = this.add.sprite(100, 300, 'bird').play('fly');
        //bird.setCollideWorldBounds(true);
        base = this.add.tileSprite(0, 500, 600, 100, 'base');
        cursors = this.input.keyboard.createCursorKeys();
    }

    function update ()
    {
        base.tilePositionX += 2.5;

        if(cursors.space.isDown && gameStarted == false){
            logo.destroy();
        }
    }