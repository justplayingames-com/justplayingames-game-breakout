///<reference types="phaser-ce" />

import BootState from "./bootState";
import PlayState from "./playState";


var game = new Phaser.Game(
    360,
    640,
    Phaser.AUTO,
    'game'
);

game.state.add('boot', new BootState());
game.state.add('play', new PlayState());

game.state.start('boot');
