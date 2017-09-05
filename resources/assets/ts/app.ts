///<reference path="../../../node_modules/phaser-ce/typescript/phaser.d.ts" />

import Background from "./background";
import Ball from "./ball";
import Brick from "./brick";
import Bricks from "./bricks";
import Diamond from "./diamond";
import Paddle from "./paddle";
import Rewards from "./rewards";
import Scoreboard from "./scoreboard";

import levels from "./levels";



var game = new Phaser.Game(
    360, 
    640, 
    Phaser.AUTO, 
    'game', 
    { preload: preload, create: create, update: update }
);


var WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, create, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Luckiest Guy', 'Lobster']
    }

};

function preload() {
    game.load.baseURL = '/assets/games/breakout/';

    game.load.atlas('breakout', 'atlas/breakout.png', 'atlas/breakout.json');
    game.load.image('starfield', 'img/starfield.png');
    game.load.image('diamond', 'img/diamond.png');
}


var background = new Background;
var scoreboard = new Scoreboard;
var ball = new Ball;
var paddle = new Paddle;
var bricks = new Bricks;
var rewards = new Rewards;

//var diamond = new Diamond;

var ballOnPaddle = true;

var lives = 3;
var score = 0;
var bonus = 0;

var level_i = 0;
var level = null;


function create() {

    level = levels[level_i];

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

    background.addToGame(game);
    scoreboard.addToGame(game);

    paddle.addToGame(game);
    ball.addToGame(game, paddle);

    bricks.addToGame(game);
    bricks.createBricks(level);

    rewards.addToGame(game);
    rewards.createRewards(level, bricks);

    ball.sprite.body.onWorldBounds.add(ballHitWorldBounds, this);
    ball.sprite.events.onOutOfBounds.add(ballLost, this);
    game.input.onDown.add(releaseBall, this);

}


function update () {

    paddle.input(game);

    if (ballOnPaddle)
    {
        ball.sprite.body.x = paddle.sprite.x;
    }
    else
    {
        game.physics.arcade.collide(
            ball.sprite, paddle.sprite, 
            ballHitPaddle, null, this
        );

        game.physics.arcade.collide(
            ball.sprite, bricks.group, 
            ballHitBrick, null, this
        );

        game.physics.arcade.collide(
            rewards.group, paddle.sprite, 
            rewardHitPaddle, null, this
        );
    }

}

function releaseBall () {

    if (ballOnPaddle)
    {
        ballOnPaddle = false;
        ball.sprite.body.velocity.y = level.ball.velocity.y;
        ball.sprite.body.velocity.x = -75;
        ball.sprite.animations.play('spin');
        scoreboard.introText.visible = false;
    }

}

function ballLost () {

    lives--;
    scoreboard.livesText.text = 'lives: ' + lives;

    if (lives === 0)
    {
        gameOver();
    }
    else
    {
        bonus = 0;
        scoreboard.bonusText.text = 'bonus: ' + bonus;

        ballOnPaddle = true;

        ball.sprite.reset(paddle.sprite.body.x + 16, paddle.sprite.y - 16);
        
        ball.sprite.animations.stop();
    }

}


function rewardLost(_sprite) {
    console.log('rewardLost')

    _sprite.kill();
}


function gameOver () {

    ball.sprite.body.velocity.setTo(0, 0);
    
    scoreboard.introText.text = 'Game Over!';
    scoreboard.introText.visible = true;

}

function ballHitWorldBounds(_ball_sprite)
{
    bonus += 1;
    scoreboard.bonusText.text = 'bonus: ' + bonus;
}

function ballHitBrick (_ball_sprite, _brick_sprite) {

    _brick_sprite.kill();

    score += _brick_sprite.data.brick.pointValue;
    score += bonus;
    bonus = 0;

    scoreboard.scoreText.text = 'score: ' + score;
    scoreboard.bonusText.text = 'bonus: ' + bonus;


    if (isLevelOver())
    {
        nextLevel();
    }
}

function isLevelOver()
{
    return (bricks.group.countLiving() == 0)
        && (rewards.group.countLiving() == 0)
}

function nextLevel()
{
    //  New level starts
    level_i = level_i + 1;
    if (level_i >= levels.length)
    {
        level_i = 0;
    }

    level = levels[level_i];

    score += 1000;
    scoreboard.scoreText.text = 'score: ' + score;
    scoreboard.introText.text = 'Level ' + level_i;
    scoreboard.introText.visible = true;

    //  Let's move the ball back to the paddle.sprite
    ballOnPaddle = true;
    ball.sprite.body.velocity.set(0);
    ball.sprite.x = paddle.sprite.x + 16;
    ball.sprite.y = paddle.sprite.y - 16;
    ball.sprite.animations.stop();

    //  create new bricks
    bricks.createBricks(level);

    // create new rewards
    rewards.createRewards(level, bricks);
}

function ballHitPaddle (_ball_sprite, _paddle_sprite) {

    bonus = 0;
    scoreboard.bonusText.text = 'bonus: ' + bonus;

    var diff = 0;

    if (_ball_sprite.x < _paddle_sprite.x)
    {
        //  Ball is on the left-hand side of the paddle_sprite
        diff = _paddle_sprite.x - _ball_sprite.x;
        _ball_sprite.body.velocity.x = (-10 * diff);
    }
    else if (_ball_sprite.x > _paddle_sprite.x)
    {
        //  Ball is on the right-hand side of the paddle_sprite
        diff = _ball_sprite.x -_paddle_sprite.x;
        _ball_sprite.body.velocity.x = (10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball_sprite.body.velocity.x = 2 + Math.random() * 8;
    }

}




function rewardHitPaddle (_paddle_sprite, _reward_sprite) {
    _reward_sprite.kill();

    score += 100;
    
    scoreboard.scoreText.text = 'score: ' + score;

    if (isLevelOver())
    {
        nextLevel();
    }
}