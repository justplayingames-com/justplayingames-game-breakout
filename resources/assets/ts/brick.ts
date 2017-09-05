export default class Brick {
    sprite: Phaser.Sprite;
    reward;

    pointValue = 10;

    constructor(group: Phaser.Group, x, y, key, frame) {
        this.addToGroup(
            group,
            x, y,
            key, frame
        );
    }

    addToGroup(group: Phaser.Group, x, y, key, frame)
    {
        this.sprite = group.create(
            x, y,
            key, frame
        );

        this.sprite.data.brick = this;

        this.sprite.body.bounce.set(1);
        this.sprite.body.immovable = true;

        this.sprite.events.onKilled.add(this.onKilled);
    }

    onKilled(_sprite)
    {
        //
    }
}
