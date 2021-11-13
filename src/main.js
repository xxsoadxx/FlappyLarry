import 'phaser';
import LoadScene from './scenes/LoadScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

var config = {
    
    scale: {

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    
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
    scene: [LoadScene, GameScene, GameOverScene],
    audio: {
        disableWebAudio: true
    }
};

const game = new Phaser.Game(config);