export default class Ball {
    sprite: Phaser.Sprite;

    addToGame(game: Phaser.Game, paddle) {
        this.sprite = game.add.sprite(
            game.world.centerX,
            paddle.sprite.y - 16,
            'breakout',
            'ball_1.png'
        );

        this.sprite.anchor.set(0.5);
        this.sprite.checkWorldBounds = true;

        game.physics.enable(
            this.sprite,
            Phaser.Physics.ARCADE
        );


        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.onWorldBounds = new Phaser.Signal();

        this.sprite.body.bounce.set(1);

        this.sprite.animations.add(
            'spin',
            [
                'ball_1.png',
                'ball_2.png',
                'ball_3.png',
                'ball_4.png',
                'ball_5.png'
            ],
            100, true, false
        );
    }

    set velocity(velocity: Phaser.Point) {
        this.sprite.body.velocity = velocity;

        if (velocity.getMagnitude() > 0) {
            this.sprite.animations.play('spin');
        }
        else {
            this.sprite.animations.stop('spin');
        }
    }

    stop() {
        this.velocity = new Phaser.Point(0, 0);
    }
}
