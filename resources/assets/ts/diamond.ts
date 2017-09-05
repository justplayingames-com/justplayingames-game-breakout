import Brick from "./brick";

export default class Diamond {
    sprite: Phaser.Sprite;

    constructor(group: Phaser.Group, brick: Brick) {
        this.addToGroup(
            group,
            brick
        );
    }

    addToGroup(group: Phaser.Group, brick: Brick) {
        this.sprite = group.create(
            brick.sprite.centerX, 
            brick.sprite.y, 
            'diamond'
        );

        this.sprite.anchor.set(0.5, 1.0);
        this.sprite.checkWorldBounds = true;
    }
}