export default class Paddle {
    sprite: Phaser.Sprite = null;
    tween: Phaser.Tween = null;
    speed: number = 720;
    inputX: number = -1;

    addToGame(game: Phaser.Game) {
        this.sprite = game.add.sprite(
            game.world.centerX, 500,
            'breakout', 'paddle_big.png'
        );

        this.sprite.anchor.setTo(0.5, 0.5);

        game.physics.enable(
            this.sprite,
            Phaser.Physics.ARCADE
        )

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.body.immovable = true;
    }

    input(game: Phaser.Game) {
        var x = game.input.x;

        if (x == this.inputX) {
            return;
        }
        else {
            this.inputX = x;
        }

        if (x < 24) {
            x = 24;
        }
        else if (x > game.width - 24) {
            x = game.width - 24;
        }

        var d = Math.abs(x - this.sprite.x);
        var t = d / this.speed * 1000;

        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }

        this.tween = game.add.tween(this.sprite).to(
            { x: x, y: this.sprite.y },
            t,
            Phaser.Easing.Default,
            true
        );
    }
}
