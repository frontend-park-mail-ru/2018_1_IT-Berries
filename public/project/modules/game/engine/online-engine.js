import Engine from './engine';
import GameSocket from './game-socket';
import GameScene from '../game-scene';

export default class OnlineEngine extends Engine {

  constructor(gameScene, eventBus, profile, side) {
    super(null, eventBus, profile);
    this.side = side;
    this.socket = new GameSocket('localhost:8080/game', eventBus);
  }

  start() {
    super.start();
    this.eventBus.on(this.events.SERVER_SENT_MAP, this.onServerSendMap);
  }

  onGameStarted(map) {
    this.map = map;
    this.gameScene = new GameScene(map[0].length, map.length, this.eventBus);
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        switch (map[i][j].owner) {
        case 'ROCKET':
          this.gameScene.setRocketByCoordinates(j, i);
          break;
        case 'UFO':
          this.gameScene.setUfoPosition(j, i);
          break;
        default:
          break;
        }
      }
    }
  }

  onGameFinished(evt) {
    throw new Error('This method must be overridden');
  }

  onPlayer1Turn(evt) {
    if (this.side === 'humans') {
      this.gameScene.playerOneTurn();
    }
  }

  onPlayer2Turn(evt) {
    if (this.side === 'aliens') {
      this.gameScene.playerOneTurn();
    }
  }

  onPlayer1Win(evt) {
    throw new Error('This method must be overridden');
  }

  onPlayer2Win(evt) {
    throw new Error('This method must be overridden');
  }

}