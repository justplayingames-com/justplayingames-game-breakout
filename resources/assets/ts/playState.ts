import Background from "./background";
import Scoreboard from "./scoreboard";
import Ball from "./ball";
import Paddle from "./paddle";
import Bricks from "./bricks";
import Rewards from "./rewards";

import levels from "./levels";
import GameData from "./gameData";


export default class PlayState {

    data: GameData;

    background: Background;
    scoreboard: Scoreboard;
    ball: Ball;
    paddle: Paddle;
    bricks: Bricks;
    rewards: Rewards;

    ballOnPaddle: Boolean;

    init(data: GameData) {
        console.log('PlayState.init')
        console.log(data)

        this.data = data;
    }

    releaseBall() {
        if (this.ballOnPaddle) {
            this.ballOnPaddle = false;

            var x = Phaser.Math.random(-1, 1) * 10;

            this.ball.velocity = new Phaser.Point(
                x,
                this.data.level.ball.velocity.y
            );

            this.scoreboard.introText.visible = false;
        }
    }

    create(game: Phaser.Game) {

        this.background = new Background;
        this.scoreboard = new Scoreboard;
        this.ball = new Ball;
        this.paddle = new Paddle;
        this.bricks = new Bricks;
        this.rewards = new Rewards;

        this.ballOnPaddle = true;

        //  We check bounds collisions against all walls other than the bottom one
        game.physics.arcade.checkCollision.down = false;

        this.background.addToGame(game);
        this.scoreboard.addToGame(game);

        this.paddle.addToGame(game);
        this.ball.addToGame(game, this.paddle);

        this.bricks.addToGame(game);
        this.bricks.createBricks(this.data.level);

        this.rewards.addToGame(game);
        this.rewards.createRewards(
            this.data.level,
            this.bricks,
            (this.rewardLost).bind(this)
        );

        this.ball.sprite.body.onWorldBounds.add(this.ballHitWorldBounds, this);
        this.ball.sprite.events.onOutOfBounds.add(this.ballLost, this);

        game.input.onDown.add(this.releaseBall, this);

        this.scoreboard.bricks = this.bricks;
        this.scoreboard.rewards = this.rewards;
    }


    update(game) {

        this.paddle.input(game);

        if (this.ballOnPaddle) {
            this.ball.sprite.body.x = this.paddle.sprite.x;
        }
        else {
            game.physics.arcade.collide(
                this.ball.sprite, this.paddle.sprite,
                this.ballHitPaddle, null, this
            );

            game.physics.arcade.collide(
                this.ball.sprite, this.bricks.group,
                this.ballHitBrick, null, this
            );

            game.physics.arcade.collide(
                this.rewards.group, this.paddle.sprite,
                this.rewardHitPaddle, null, this
            );
        }

    }


    ballLost() {

        this.data.lives--;
        this.scoreboard.lives = this.data.lives;

        if (this.data.lives === 0) {
            this.gameOver();
        }
        else {
            this.data.bonus = 0;
            this.scoreboard.bonus = this.data.bonus;

            this.ballOnPaddle = true;

            this.ball.stop(
                this.paddle.sprite.body.x + 16,
                this.paddle.sprite.y - 16
            );

            this.ball.sprite.animations.stop();
        }
    }

    rewardLost() {
        console.log('rewardLost')

        this.scoreboard.rewards = this.rewards;
    }

    gameOver() {
        this.ball.stop();

        this.scoreboard.introText.text = 'Game Over!';
        this.scoreboard.introText.visible = true;
    }

    ballHitWorldBounds(_ball_sprite) {
        this.data.bonus += 1;
        this.scoreboard.bonus = this.data.bonus;
    }

    ballHitBrick(_ball_sprite, _brick_sprite) {

        _brick_sprite.kill();

        this.data.score += _brick_sprite.data.brick.pointValue;
        this.data.score += this.data.bonus;
        this.data.bonus = 0;

        this.scoreboard.score = this.data.score;
        this.scoreboard.bonus = this.data.bonus;
        this.scoreboard.bricks = this.bricks;

        if (this.isLevelOver()) {
            this.nextLevel();
        }
    }

    isLevelOver() {
        return (this.bricks.group.countLiving() == 0)
            && (this.rewards.group.countLiving() == 0)
    }

    nextLevel() {
        //  New level starts
        this.data.levelManager.nextLevel();

        this.data.score += 1000;
        this.scoreboard.score = this.data.score;
        this.scoreboard.introText.text = 'Level ' + this.data.levelNumber;
        this.scoreboard.introText.visible = true;

        //  Let's move the ball back to the paddle.sprite
        this.ballOnPaddle = true;
        this.ball.stop(
            this.paddle.sprite.x + 16,
            this.paddle.sprite.y - 16
        );

        //  create new bricks
        this.bricks.createBricks(this.data.level);

        // create new rewards
        this.rewards.createRewards(
            this.data.level,
            this.bricks,
            (this.rewardLost).bind(this)
        );

        this.scoreboard.bricks = this.bricks;
        this.scoreboard.rewards = this.rewards;
    }

    ballHitPaddle(_ball_sprite, _paddle_sprite) {

        this.data.bonus = 0;
        this.scoreboard.bonus = this.data.bonus;

        var diff = 0;

        if (_ball_sprite.x < _paddle_sprite.x) {
            //  Ball is on the left-hand side of the paddle_sprite
            diff = _paddle_sprite.x - _ball_sprite.x;
            _ball_sprite.body.velocity.x = (-10 * diff);
        }
        else if (_ball_sprite.x > _paddle_sprite.x) {
            //  Ball is on the right-hand side of the paddle_sprite
            diff = _ball_sprite.x - _paddle_sprite.x;
            _ball_sprite.body.velocity.x = (10 * diff);
        }
        else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball_sprite.body.velocity.x = 2 + Math.random() * 8;
        }
    }

    rewardHitPaddle(_paddle_sprite, _reward_sprite) {
        _reward_sprite.kill();
        _reward_sprite.data.diamond.updateGameData(this.data);

        this.scoreboard.data = this.data;
        this.scoreboard.rewards = this.rewards;

        if (this.isLevelOver()) {
            this.nextLevel();
        }
    }
}
