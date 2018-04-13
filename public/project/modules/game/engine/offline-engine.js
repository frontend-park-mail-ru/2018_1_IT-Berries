import Engine from './engine.js';
import Map from './map.js';
import Bot from './bot.js';

export default class OfflineEngine extends Engine{
  constructor(gameScene, eventBus) {
    super(gameScene, eventBus);
  }

  start() {
    super.start();
    this.eventBus.emit(this.events.START_GAME);
  }

  onGameStarted(evt) {
    this.gameScene.reset();
    this.map = new Map(this.gameScene.getX(), this.gameScene.getY()).map;
    this.bot = new Bot(this.map, this.gameScene.getUfoStartPosition());
    this.eventBus.emit(this.events.PLAYER_1_TURN);
  }

  onPlayer1Turn(evt) {
    const ufoX = this.bot.getPosition().x;
    const ufoY = this.bot.getPosition().y;
    if (ufoX === 0 || ufoX === this.gameScene.getX() || ufoY === 0 || ufoY === this.gameScene.getY()) {
      this.eventBus.emit(this.events.FINISH_GAME);
    } else {
      this.gameScene.playerOneTurn();
    }
  }

  onPlayer2Turn(evt) {
    let rocketcolumn = evt.parentNode.className.match(/\d+/g)[0];
    let rocketrow = evt.parentNode.parentNode.parentNode.parentNode.classList[0].match(/\d+/g)[0];
    this.map[rocketrow][rocketcolumn].isRocket = true;
    let newStep = this.bot.searchWay();
    if (newStep === 'No way!') {
      alert('You win!');
      window.location = '/game';
    }
    this.gameScene.stepUfoTo(newStep);
    this.eventBus.emit(this.events.PLAYER_1_TURN);
  }

  onGameFinished(evt) {
    this.eventBus.emit('CLOSE_GAME');
  }

  onGameStateChanged(evt) {
    this.gameScene.setState(evt);
  }
}