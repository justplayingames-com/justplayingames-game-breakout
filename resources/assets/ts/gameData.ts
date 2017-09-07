
import LevelManager from "./levelManager";

export default class GameData {

    config: any = null
    levelManager: LevelManager;

    lives: number = 3;
    score: number = 0;
    bonus: number = 0;

    constructor(config: any) {
        this.config = config;

        this.levelManager = new LevelManager(this.config);
    }

    get level() {
        return this.levelManager.level;
    }

    get levelNumber() {
        return this.levelManager.levelNumber;
    }
}