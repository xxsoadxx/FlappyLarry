import 'phaser';
import LoadScene from './scenes/LoadScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

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
    scene: [LoadScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);