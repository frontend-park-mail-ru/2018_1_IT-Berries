import GAME_MODES from './modes.js';
import GameScene from './game-scene.js';
import OfflineEngine from './engine/offline-engine.js';
import OnlineEngine from './engine/online-engine.js';


export default class Game {
  constructor(mode, eventBus, profile, side) {
    let GameEngine = null;
    switch (mode) {
    case GAME_MODES.ONLINE: {
      GameEngine = OnlineEngine;
      break;
    }
    case GAME_MODES.OFFLINE: {
      GameEngine = OfflineEngine;
      this.gameScene = new GameScene(9, 9, eventBus);
      break;
    }
    default:
      throw new Error('Invalid game mode ' + mode);
    }
    this.engine = new GameEngine(this.gameScene, eventBus, profile, side);
  }
  start() {
    this.engine.start();
  }

  destroy() {
    this.engine.clear();
  }
}