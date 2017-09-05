/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(11);
module.exports = __webpack_require__(12);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

///<reference path="../../../node_modules/phaser-ce/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var background_1 = __webpack_require__(2);
var ball_1 = __webpack_require__(3);
var bricks_1 = __webpack_require__(4);
var paddle_1 = __webpack_require__(6);
var rewards_1 = __webpack_require__(7);
var scoreboard_1 = __webpack_require__(9);
var levels_1 = __webpack_require__(10);
var game = new Phaser.Game(360, 640, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
var WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function () { game.time.events.add(Phaser.Timer.SECOND, create, this); },
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
var background = new background_1.default;
var scoreboard = new scoreboard_1.default;
var ball = new ball_1.default;
var paddle = new paddle_1.default;
var bricks = new bricks_1.default;
var rewards = new rewards_1.default;
//var diamond = new Diamond;
var ballOnPaddle = true;
var lives = 3;
var score = 0;
var bonus = 0;
var level_i = 0;
var level = null;
function create() {
    level = levels_1.default[level_i];
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
function update() {
    paddle.input(game);
    if (ballOnPaddle) {
        ball.sprite.body.x = paddle.sprite.x;
    }
    else {
        game.physics.arcade.collide(ball.sprite, paddle.sprite, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball.sprite, bricks.group, ballHitBrick, null, this);
        game.physics.arcade.collide(rewards.group, paddle.sprite, rewardHitPaddle, null, this);
    }
}
function releaseBall() {
    if (ballOnPaddle) {
        ballOnPaddle = false;
        ball.sprite.body.velocity.y = level.ball.velocity.y;
        ball.sprite.body.velocity.x = -75;
        ball.sprite.animations.play('spin');
        scoreboard.introText.visible = false;
    }
}
function ballLost() {
    lives--;
    scoreboard.livesText.text = 'lives: ' + lives;
    if (lives === 0) {
        gameOver();
    }
    else {
        bonus = 0;
        scoreboard.bonusText.text = 'bonus: ' + bonus;
        ballOnPaddle = true;
        ball.sprite.reset(paddle.sprite.body.x + 16, paddle.sprite.y - 16);
        ball.sprite.animations.stop();
    }
}
function rewardLost(_sprite) {
    console.log('rewardLost');
    _sprite.kill();
}
function gameOver() {
    ball.sprite.body.velocity.setTo(0, 0);
    scoreboard.introText.text = 'Game Over!';
    scoreboard.introText.visible = true;
}
function ballHitWorldBounds(_ball_sprite) {
    bonus += 1;
    scoreboard.bonusText.text = 'bonus: ' + bonus;
}
function ballHitBrick(_ball_sprite, _brick_sprite) {
    _brick_sprite.kill();
    score += _brick_sprite.data.brick.pointValue;
    score += bonus;
    bonus = 0;
    scoreboard.scoreText.text = 'score: ' + score;
    scoreboard.bonusText.text = 'bonus: ' + bonus;
    if (isLevelOver()) {
        nextLevel();
    }
}
function isLevelOver() {
    return (bricks.group.countLiving() == 0)
        && (rewards.group.countLiving() == 0);
}
function nextLevel() {
    //  New level starts
    level_i = level_i + 1;
    if (level_i >= levels_1.default.length) {
        level_i = 0;
    }
    level = levels_1.default[level_i];
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
function ballHitPaddle(_ball_sprite, _paddle_sprite) {
    bonus = 0;
    scoreboard.bonusText.text = 'bonus: ' + bonus;
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
function rewardHitPaddle(_paddle_sprite, _reward_sprite) {
    _reward_sprite.kill();
    score += 100;
    scoreboard.scoreText.text = 'score: ' + score;
    if (isLevelOver()) {
        nextLevel();
    }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Background = (function () {
    function Background() {
    }
    Background.prototype.addToGame = function (game) {
        this.sprite = game.add.tileSprite(0, 0, game.width, game.height, 'starfield');
    };
    return Background;
}());
exports.default = Background;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Ball = (function () {
    function Ball() {
    }
    Ball.prototype.addToGame = function (game, paddle) {
        this.sprite = game.add.sprite(game.world.centerX, paddle.sprite.y - 16, 'breakout', 'ball_1.png');
        this.sprite.anchor.set(0.5);
        this.sprite.checkWorldBounds = true;
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.onWorldBounds = new Phaser.Signal();
        this.sprite.body.bounce.set(1);
        this.sprite.animations.add('spin', [
            'ball_1.png',
            'ball_2.png',
            'ball_3.png',
            'ball_4.png',
            'ball_5.png'
        ], 50, true, false);
    };
    return Ball;
}());
exports.default = Ball;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var brick_1 = __webpack_require__(5);
var Bricks = (function () {
    function Bricks() {
    }
    Bricks.prototype.addToGame = function (game) {
        this.group = game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;
    };
    Bricks.prototype.createBricks = function (level) {
        this.array = [];
        this.group.removeAll(true);
        var brick;
        for (var y = 0; y < level.bricks.rows; y++) {
            for (var x = 0; x < level.bricks.columns; x++) {
                var png = 'brick_' + ((y % 4) + 1) + '_1.png';
                brick = new brick_1.default(this.group, level.bricks.origin.x + (x * level.bricks.offset.x), level.bricks.origin.y + (y * level.bricks.offset.y), 'breakout', png);
                this.array.push(brick);
            }
        }
    };
    return Bricks;
}());
exports.default = Bricks;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Brick = (function () {
    function Brick(group, x, y, key, frame) {
        this.pointValue = 10;
        this.addToGroup(group, x, y, key, frame);
    }
    Brick.prototype.addToGroup = function (group, x, y, key, frame) {
        this.sprite = group.create(x, y, key, frame);
        this.sprite.data.brick = this;
        this.sprite.body.bounce.set(1);
        this.sprite.body.immovable = true;
        this.sprite.events.onKilled.add(this.onKilled);
    };
    Brick.prototype.onKilled = function (_sprite) {
        //
    };
    return Brick;
}());
exports.default = Brick;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Paddle = (function () {
    function Paddle() {
        this.sprite = null;
        this.tween = null;
        this.speed = 720;
        this.inputX = -1;
    }
    Paddle.prototype.addToGame = function (game) {
        this.sprite = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
        this.sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.body.immovable = true;
    };
    Paddle.prototype.input = function (game) {
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
        this.tween = game.add.tween(this.sprite).to({ x: x, y: this.sprite.y }, t, Phaser.Easing.Default, true);
    };
    return Paddle;
}());
exports.default = Paddle;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var diamond_1 = __webpack_require__(8);
var Rewards = (function () {
    function Rewards() {
    }
    Rewards.prototype.addToGame = function (game) {
        this.group = game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;
    };
    Rewards.prototype.createRewards = function (level, bricks) {
        var _this = this;
        this.group.removeAll(true);
        level.rewards.forEach(function (reward) {
            var brick = bricks.array[reward.bricks_index];
            var diamond = new diamond_1.default(_this.group, brick);
            brick.sprite.events.onKilled.add(function () {
                diamond.sprite.body.gravity.y = level.reward.gravity;
            });
            diamond.sprite.events.onOutOfBounds.add(function (_sprite) {
                console.log('diamond out of bounds');
                console.log(_sprite);
                _sprite.kill();
            });
        });
    };
    return Rewards;
}());
exports.default = Rewards;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Diamond = (function () {
    function Diamond(group, brick) {
        this.addToGroup(group, brick);
    }
    Diamond.prototype.addToGroup = function (group, brick) {
        this.sprite = group.create(brick.sprite.centerX, brick.sprite.y, 'diamond');
        this.sprite.anchor.set(0.5, 1.0);
        this.sprite.checkWorldBounds = true;
    };
    return Diamond;
}());
exports.default = Diamond;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Scoreboard = (function () {
    function Scoreboard() {
    }
    Scoreboard.prototype.addToGame = function (game) {
        this.titleText = game.add.text(0, 0, 'Breakout', { font: "54px monospace" });
        var grd = this.titleText.context.createLinearGradient(0, 0, 0, this.titleText.canvas.height);
        grd.addColorStop(0, '#FFF');
        grd.addColorStop(1, '#0F0');
        this.titleText.fill = grd;
        this.titleText.align = 'center';
        this.titleText.stroke = '#000000';
        this.titleText.strokeThickness = 2;
        this.titleText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        this.scoreText = game.add.text(0, 54, 'score: 0', { font: "20px monospace", fill: "#0f0", align: "left" });
        this.bonusText = game.add.text(0, 74, 'bonus: 0', { font: "20px monospace", fill: "#0f0", align: "left" });
        this.livesText = game.add.text(180, 54, 'lives: 3', { font: "20px monospace", fill: "#0f0", align: "left" });
        this.introText = game.add.text(game.world.centerX, 400, 'click to start', { font: "40px monospace", fill: "#ffffff", align: "center" });
        this.introText.anchor.setTo(0.5, 0.5);
    };
    return Scoreboard;
}());
exports.default = Scoreboard;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levels = [
    {
        ball: {
            velocity: {
                y: -160
            }
        },
        bricks: {
            rows: 1,
            columns: 5,
            origin: {
                x: 104,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        },
        reward: {
            gravity: 70
        },
        rewards: [
            {
                bricks_index: 2
            }
        ]
    },
    {
        ball: {
            velocity: {
                y: -200
            }
        },
        bricks: {
            rows: 2,
            columns: 6,
            origin: {
                x: 78,
                y: 200
            },
            offset: {
                x: 34,
                y: 52
            }
        },
        reward: {
            gravity: 70
        },
        rewards: [
            {
                bricks_index: 1
            },
            {
                bricks_index: 4
            }
        ]
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
        },
        reward: {
            gravity: 98
        },
        rewards: [
            {
                bricks_index: 2
            }
        ]
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
        },
        reward: {
            gravity: 98
        },
        rewards: [
            {
                bricks_index: 2
            }
        ]
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
        },
        reward: {
            gravity: 98
        },
        rewards: [
            {
                bricks_index: 2
            }
        ]
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
        },
        reward: {
            gravity: 98
        },
        rewards: [
            {
                bricks_index: 2
            }
        ]
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
        },
        reward: {
            gravity: 98
        },
        rewards: [
            {
                bricks_index: 2
            }
        ]
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
        },
        reward: {
            gravity: 98
        },
        rewards: [
            {
                bricks_index: 2
            }
        ]
    },
];
exports.default = levels;


/***/ }),
/* 11 */
/***/ (function(module, exports) {



/***/ }),
/* 12 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);