export default class Splashscreen {
    titleText: Phaser.Text;
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

        this.introText = game.add.text(game.world.centerX, 400, 'click to start', { font: "40px monospace", fill: "#ffffff", align: "center" });
        this.introText.anchor.setTo(0.5, 0.5);
    }
}