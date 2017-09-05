export default class Background {
    sprite

    addToGame(game: Phaser.Game)
    {
        this.sprite = game.add.tileSprite(
            0, 0, 
            game.width, game.height, 
            'starfield'
        );
    }
}
