import Engine from './engine';
import GameSocket from './game-socket';

export default class OnlineEngine extends Engine {

  constructor(gameScene, eventBus, profile) {
    super(null, eventBus, profile);
    this.socket = new GameSocket('localhost:8080/game', eventBus);
  }

  start() {
    super.start();
  }

  onGameStarted(evt) {
    throw new Error('This method must be overridden');
  }

  onGameFinished(evt) {
    throw new Error('This method must be overridden');
  }

  onPlayer1Turn(evt) {
    throw new Error('This method must be overridden');
  }

  onPlayer2Turn(evt) {
    throw new Error('This method must be overridden');
  }

  onPlayer1Win(evt) {
    throw new Error('This method must be overridden');
  }

  onPlayer2Win(evt) {
    throw new Error('This method must be overridden');
  }

}