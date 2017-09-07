import GameData from "./gameData";


export default class BootState {

    data: GameData = null;

    //  The Google WebFont Loader will look for this object, so create it before loading the script.
    WebFontConfig = {

        //  'active' means all requested fonts have finished loading
        //  We set a 1 second delay before calling 'createText'.
        //  For some reason if we don't the browser cannot render the text the first time it's created.
        active: function () { console.log('webfonts active') },

        //  The Google Fonts we want to load (specify as many as you like in the array)
        google: {
            families: ['Luckiest Guy', 'Lobster']
        }

    }

    init(config: any) {
        console.log('BootState.init');

        this.data = new GameData(config);
    }

    preload(game: Phaser.Game) {
        console.log('BootState.preload');

        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        game.load.baseURL = '/assets/games/breakout/';

        game.load.atlas('breakout', 'atlas/breakout.png', 'atlas/breakout.json');
        game.load.image('starfield', 'img/starfield.png');
        game.load.image('diamond', 'img/diamond.png');
    }

    create(game: Phaser.Game) {
        console.log('BootState.create');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.state.start(
            'play',
            false,
            false,
            this.data
        );
    }
}
