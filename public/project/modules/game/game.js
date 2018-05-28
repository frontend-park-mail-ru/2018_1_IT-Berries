import GAME_MODES from './modes.js';
import GameScene from './game-scene.js';
import OfflineEngine from './engine/offline-engine.js';
import OnlineEngine from './engine/online-engine.js';

export let side = null;

export default class Game {

  constructor(mode, eventBus, profile) {
    let GameEngine = null;
    switch (mode) {
    case GAME_MODES.ONLINE: {
      GameEngine = OnlineEngine;
      break;
    }
    case GAME_MODES.OFFLINE: {
      GameEngine = OfflineEngine;
      this.gameScene = new GameScene(9, 9, eventBus, Game.getSide(), 'offline');
      break;
    }
    default:
      throw new Error('Invalid game mode ' + mode);
    }
    this.engine = new GameEngine(this.gameScene, eventBus, profile, Game.getSide());
  }
  start() {
    this.engine.start();
  }

  destroy() {
    this.engine.clear();
  }

  static getSide() {
    return side;
  }

  static setSide(newSIde) {
    side = newSIde;
  }
}