
import Brick from "./brick";
import Diamond from "./diamond";

export default class Rewards {
    group: Phaser.Group;

    addToGame(game: Phaser.Game) {
        this.group = game.add.group()
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;
    }

    createRewards(level, bricks) {
        this.group.removeAll(true);

        level.rewards.forEach(reward => {
            var brick: Brick = bricks.array[reward.bricks_index];

            var diamond: Diamond = new Diamond(
                this.group, 
                brick
            );

            brick.sprite.events.onKilled.add(function () {
                diamond.sprite.body.gravity.y = level.reward.gravity;
            });

            diamond.sprite.events.onOutOfBounds.add(function(_sprite) {
                console.log('diamond out of bounds')
                console.log(_sprite);
                _sprite.kill();
            })
        });
    }
}