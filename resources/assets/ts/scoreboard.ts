import GameData from "./gameData";
import Rewards from "./rewards";
import Bricks from "./bricks";

export default class Scoreboard {
    titleText: Phaser.Text;
    scoreText: Phaser.Text;
    bonusText: Phaser.Text;
    livesText: Phaser.Text;
    bricksText: Phaser.Text;
    rewardsText: Phaser.Text;
    introText: Phaser.Text;

    addToGame(game: Phaser.Game) {
        this.titleText = game.add.text(0, 0, 'Breakout', { font: "54px monospace" });
        var grd = this.titleText.context.createLinearGradient(
            0, 0,
            0, this.titleText.canvas.height
        );
        grd.addColorStop(0, '#FFF');
        grd.addColorStop(1, '#0F0');
        this.titleText.fill = grd;

        this.titleText.align = 'center';
        this.titleText.stroke = '#000000';
        this.titleText.strokeThickness = 2;
        this.titleText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        this.scoreText = game.add.text(0, 54, 'score: 0', { font: "20px monospace", fill: "#0f0", align: "left" });
        this.livesText = game.add.text(180, 54, 'lives: 3', { font: "20px monospace", fill: "#0f0", align: "left" });
        this.bonusText = game.add.text(0, 74, 'bonus: 0', { font: "20px monospace", fill: "#0f0", align: "left" });
        this.bricksText = game.add.text(0, 94, 'bricks:', { font: "20px monospace", fill: "#0f0", align: "left" });
        this.rewardsText = game.add.text(180, 94, 'rewards:', { font: "20px monospace", fill: "#0f0", align: "left" });


        this.introText = game.add.text(game.world.centerX, 400, 'click to start', { font: "40px monospace", fill: "#ffffff", align: "center" });
        this.introText.anchor.setTo(0.5, 0.5);
    }

    set lives(value: number) {
        this.livesText.text = 'lives: ' + value;
    }

    set bonus(value: number) {
        this.bonusText.text = 'bonus: ' + value;
    }

    set score(value: number) {
        this.scoreText.text = 'score: ' + value;
    }

    set bricks(items: Bricks) {
        this.bricksText.text = 'bricks: ' + items.group.countDead() + '/' + items.group.countLiving();
    }

    set rewards(items: Rewards) {
        this.rewardsText.text = 'rewards: ' + items.group.countDead() + '/' + items.group.countLiving();
    }

    set data(data: GameData) {
        this.lives = data.lives;
        this.bonus = data.bonus;
        this.score = data.score;
    }
}
