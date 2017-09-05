import Brick from "./brick";


export default class Bricks {
    array: Brick[];
    group: Phaser.Group;

    addToGame(game: Phaser.Game) {
        this.group = game.add.group()
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;
    }

    createBricks(level) {
        this.array = [];
        this.group.removeAll(true);

        var brick;
        for (var y = 0; y < level.bricks.rows; y++)
        {
            for (var x = 0; x < level.bricks.columns; x++)
            {
                var png = 'brick_' + ((y % 4) + 1) + '_1.png'

                brick = new Brick(
                    this.group,
                    level.bricks.origin.x + (x * level.bricks.offset.x), 
                    level.bricks.origin.y + (y * level.bricks.offset.y), 
                    'breakout', png
                )

                this.array.push(brick);
            }
        }
    }
}