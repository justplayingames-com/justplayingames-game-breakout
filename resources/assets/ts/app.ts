///<reference path="../../../node_modules/phaser-ce/typescript/phaser.d.ts" />


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
    game.load.baseURL = 'http://192.168.1.6:8000/assets/games/breakout/';

    game.load.atlas('breakout', 'atlas/breakout.png', 'atlas/breakout.json');
    game.load.image('starfield', 'img/starfield.png');
}

var ball;
var paddle;
var bricks;
var background = {
    sprite: null,
    filter: null
};

var ballOnPaddle = true;

var lives = 3;
var score = 0;

var titleText;
var scoreText;
var livesText;
var introText;

var update_tick = 0;

var s;

var levels = [
    {
        ball: {
            velocity: {
                y: -200
            }
        },

        bricks: {
            rows: 1,
            columns: 6,
            origin: {
                x: 78,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        }
    },

    {
        ball: {
            velocity: {
                y: -200
            }
        },

        bricks: {
            rows: 2,
            columns: 10,
            origin: {
                x: 10,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        }
    },

    {
        ball: {
            velocity: {
                y: -250
            }
        },

        bricks: {
            rows: 2,
            columns: 10,
            origin: {
                x: 10,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        }
    },

    {
        ball: {
            velocity: {
                y: -250
            }
        },

        bricks: {
            rows: 3,
            columns: 10,
            origin: {
                x: 10,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        }
    },

    {
        ball: {
            velocity: {
                y: -250
            }
        },

        bricks: {
            rows: 4,
            columns: 10,
            origin: {
                x: 10,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        }
    },

    {
        ball: {
            velocity: {
                y: -300
            }
        },

        bricks: {
            rows: 4,
            columns: 10,
            origin: {
                x: 10,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        }
    },

    {
        ball: {
            velocity: {
                y: -300
            }
        },

        bricks: {
            rows: 5,
            columns: 10,
            origin: {
                x: 10,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        }
    },

   {
        ball: {
            velocity: {
                y: -300
            }
        },

        bricks: {
            rows: 6,
            columns: 10,
            origin: {
                x: 10,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        }
    },
];


var level_i = 0;
var level = null;

function createBricks() {
    var brick;

    for (var y = 0; y < level.bricks.rows; y++)
    {
        for (var x = 0; x < level.bricks.columns; x++)
        {
            var png = 'brick_' + ((y % 4) + 1) + '_1.png'

            brick = bricks.create(
                level.bricks.origin.x + (x * level.bricks.offset.x), 
                level.bricks.origin.y + (y * level.bricks.offset.y), 
                'breakout', png
            );

            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }
}


function create() {

    level = levels[level_i];

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

    background.sprite = game.add.tileSprite(
        0, 0, 360, 640, 
        'starfield'
    );

    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;

    createBricks();

    paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
    paddle.anchor.setTo(0.5, 0.5);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
    ball.anchor.set(0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);

    ball.events.onOutOfBounds.add(ballLost, this);

    titleText = game.add.text(0, 0, 'Breakout', {font: "54px monospace"});
    var grd = titleText.context.createLinearGradient(0, 0, 0, titleText.canvas.height);
    grd.addColorStop(0, '#FFF');
    grd.addColorStop(1, '#0F0');
    titleText.fill = grd;

    titleText.align = 'center';
    titleText.stroke = '#000000';
    titleText.strokeThickness = 2;
    titleText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);


    scoreText = game.add.text(180, 54, 'score: 0', { font: "20px monospace", fill: "#0f0", align: "left" });
    livesText = game.add.text(0, 54, 'lives: 3', { font: "20px monospace", fill: "#0f0", align: "left" });
    introText = game.add.text(game.world.centerX, 400, 'click to start', { font: "40px monospace", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(releaseBall, this);

}


function update () {

    //  Fun, but a little sea-sick inducing :) Uncomment if you like!
    // s.tilePosition.x += (game.input.speed.x / 2);

    paddle.x = game.input.x;

    if (paddle.x < 24)
    {
        paddle.x = 24;
    }
    else if (paddle.x > game.width - 24)
    {
        paddle.x = game.width - 24;
    }

    if (ballOnPaddle)
    {
        ball.body.x = paddle.x;
    }
    else
    {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
    }

}

function releaseBall () {

    if (ballOnPaddle)
    {
        ballOnPaddle = false;
        ball.body.velocity.y = level.ball.velocity.y;
        ball.body.velocity.x = -75;
        ball.animations.play('spin');
        introText.visible = false;
    }

}

function ballLost () {

    lives--;
    livesText.text = 'lives: ' + lives;

    if (lives === 0)
    {
        gameOver();
    }
    else
    {
        ballOnPaddle = true;

        ball.reset(paddle.body.x + 16, paddle.y - 16);
        
        ball.animations.stop();
    }

}

function gameOver () {

    ball.body.velocity.setTo(0, 0);
    
    introText.text = 'Game Over!';
    introText.visible = true;

}

function ballHitBrick (_ball, _brick) {

    _brick.kill();

    score += 10;

    scoreText.text = 'score: ' + score;

    //  Are they any bricks left?
    if (bricks.countLiving() == 0)
    {
        //  New level starts
        level_i = level_i + 1;
        if (level_i >= levels.length)
        {
            level_i = 0;
        }

        level = levels[level_i];

        score += 1000;
        scoreText.text = 'score: ' + score;
        introText.text = 'Level ' + level_i;
        introText.visible = true;

        //  Let's move the ball back to the paddle
        ballOnPaddle = true;
        ball.body.velocity.set(0);
        ball.x = paddle.x + 16;
        ball.y = paddle.y - 16;
        ball.animations.stop();

        //  create new bricks
        bricks.removeAll(true);
        createBricks();
    }

}

function ballHitPaddle (_ball, _paddle) {

    var diff = 0;

    if (_ball.x < _paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }

}