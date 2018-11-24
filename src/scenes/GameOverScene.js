class GameOverScene extends Phaser.Scene
{
    constructor ()
    {
        super('GameOverScene');
    }

    create ()
    {
        this.score = this.registry.values.score.pts;
        this.bestScore = this.registry.values.bestScore == null ? 0 : this.registry.values.bestScore;

        this.scoreBoard = this.add.image(this.game.config.width/2, this.game.config.height/2, 'scoreBoard');
        this.scoreBoard.setDepth(4);

        this.replay = this.add.image(this.game.config.width/2, 3*this.game.config.height/4, 'replay').setInteractive();
        this.replay.setDepth(4);
        this.replay.setInteractive = true;

        this.replay.on('pointerdown', () => {
            this.scene.stop();
            this.game.scene.stop('GameScene');
            this.scene.launch('GameScene');
        });
        this.currentScoreText = this.add.bitmapText(3*this.game.config.width/4 + 5, this.game.config.height/2 - 35, 'font', this.score, 20);
        this.currentScoreText.setDepth(4);

        this.bestScoreText = this.add.bitmapText(3*this.game.config.width/4 + 5, this.game.config.height/2 +5, 'font', this.bestScore, 20);
        this.bestScoreText.setDepth(4);
        this.getBestScore(this.score);
        this.bestScoreText.text = this.bestScore;

        let medalColor = this.getMedal();
        if(medalColor != '')
        {
            this.add.image(80, 251, medalColor).setDepth(5);
        }
    }

    getBestScore (score)
    {
        if(score >= this.bestScore)
        {
            this.bestScore = score;
            this.registry.set('bestScore', this.bestScore);
        }
    }

    getMedal ()
    {
        let medalColor = '';
        
        if(10 <= this.score && this.score < 20){
            medalColor = 'medal-bronze';
        }
        else if(20 <= this.score && this.score < 30){
            medalColor = 'medal-silver';
        }
        else if(30 <= this.score && this.score < 50){
            medalColor = 'medal-gold';
        }
        else if(this.score > 50){
            medalColor = 'medal-platinum';
        }
        return medalColor;
    }
}

export default GameOverScene;