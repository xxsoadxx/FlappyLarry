class LoadScene extends Phaser.Scene  
{
    constructor ()
    {
        super('LoadScene');
    }

    preload ()
    {
        this.load.audio('intro', [
            'assets/audio/intro.mp3'
        ]);
        this.load.audio('pow', [
            'assets/audio/pow.mp3'
        ]);
        this.load.audio('music', [
            'assets/audio/music.mp3'
        ]);
        this.load.image('title', 'assets/sprites/title.png');

        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        this.load.image('power-up', 'assets/sprites/powerup.png');
        this.load.image('background-day', 'assets/sprites/background-day.png');
        this.load.image('background-night', 'assets/sprites/background-night.png');
        this.load.image('base', 'assets/sprites/base.png');  
        this.load.image('intro', 'assets/sprites/message.png');
        this.load.image('scoreBoard', 'assets/sprites/scoreboard.png');
        this.load.image('pipe', 'assets/sprites/pipe-green.png');
        this.load.image('replay', 'assets/sprites/replay.png');
        this.load.image('medal-bronze', 'assets/sprites/medal_bronze.png');
        this.load.image('medal-silver', 'assets/sprites/medal_silver.png');
        this.load.image('medal-gold', 'assets/sprites/medal_gold.png');
        this.load.image('medal-platinum', 'assets/sprites/medal_platinum.png');

        // Larry
        this.load.spritesheet('larry', 'assets/sprites/flarry.png', {
            frameWidth: 34,
            frameHeight: 24
        })
    }

    create ()
    {
        window.addEventListener('resize', this.resize);
        this.resize();
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.label = this.add.text(screenCenterX, screenCenterY, 'UpShow Presents')
        this.label.setOrigin(0.5, 0.5)

        this.anims.create({
            key: 'clapWings',
            frames: this.anims.generateFrameNumbers('larry', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'stop',
            frames: [{
                key: 'larry',
                frame: 1
            }],
            frameRate: 20
        })

        var intro = this.sound.add('intro');
        
        setTimeout((function () {
            intro.play();
        }).bind(this), 1000)

       

        var width = window.innerWidth, height = window.innerHeight;
        this.scale.displaySize.setAspectRatio( width/height );
        this.scale.refresh();

        //check to see if the audio is decoded
       // if (this.cache.isSoundDecoded('pow')) {

        this.time.addEvent ({ delay: 4000, callback: this.startgame, callbackScope: this, loop: false }); 

        
    
    }

    resize ()
    {
        var canvas = document.querySelector("canvas"), width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;
        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } 
        else if (wratio < 0.90) {
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
        }
        else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    
    }
    startgame() {
        this.scene.start('GameScene');
    }
}

export default LoadScene;