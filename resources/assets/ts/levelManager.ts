import levels from "./levels";

export default class LevelManager {

    levelNumber: number = 0;
    level: any = null

    constructor(config: any) {
        this.level = levels[this.levelNumber];
    }

    nextLevel() {
        this.levelNumber = this.levelNumber + 1;
        if (this.levelNumber >= levels.length) {
            this.levelNumber = 0;
        }

        this.level = levels[this.levelNumber];
    }
}