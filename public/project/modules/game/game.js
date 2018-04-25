import GAME_MODES from './modes.js';
import GameScene from './game-scene.js';
import OfflineEngine from './engine/offline-engine.js';


export default class Game {
  constructor(mode, eventBus, profile) {
    let GameEngine = null;
    switch (mode) {
    case GAME_MODES.ONLINE: {
      break;
    }
    case GAME_MODES.OFFLINE: {
      GameEngine = OfflineEngine;
      break;
    }
    default:
      throw new Error('Invalid game mode ' + mode);
    }
    this.gameScene = new GameScene(9, 9, eventBus);
    this.engine = new GameEngine(this.gameScene, eventBus, profile);
  }
  start() {
    this.engine.start();
  }

  destroy() {
    this.engine.clear();
  }
}