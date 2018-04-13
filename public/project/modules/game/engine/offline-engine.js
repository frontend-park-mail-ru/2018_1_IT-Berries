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

  async onPlayer1Turn(evt) {
    const ufoX = this.bot.getPosition().x;
    const ufoY = this.bot.getPosition().y;
    if (ufoX === 0 || ufoX + 1 === this.gameScene.getX() + (ufoY) % 2 || ufoY === 0 || ufoY + 1 === this.gameScene.getY()) {
      this.eventBus.emit(this.events.FINISH_GAME, this.events.PLAYER_2_WIN);
    } else {
      this.gameScene.playerOneTurn();
    }
  }

  async onPlayer2Turn(evt) {
    let rocketcolumn = evt.parentNode.className.match(/\d+/g)[0];
    let rocketrow = evt.parentNode.parentNode.parentNode.parentNode.classList[0].match(/\d+/g)[0];
    this.map[rocketrow][rocketcolumn].isRocket = true;
    let newStep = this.bot.searchWay();
    if (newStep === 'No way!') {
      this.eventBus.emit(this.events.onGameFinished, this.events.PLAYER_1_WIN);
    }
    await this.gameScene.stepUfoTo(newStep);
    this.eventBus.emit(this.events.PLAYER_1_TURN);
  }

  onGameFinished(callingEvents) {
    const endGamePanel = document.getElementsByClassName('end-game-panel')[0];
    endGamePanel.style.visibility = 'visible';
    endGamePanel.getElementsByClassName('end-game-panel__button')[0].addEventListener('click', () => {
      endGamePanel.style.visibility = 'hidden';
      this.eventBus.emit(callingEvents);
    });
  }

  onPlayer1Win(evt) {
    this.eventBus.emit('win');
    this.destroy();
  }

  onPlayer2Win(evt) {
    this.eventBus.emit('lose');
    this.destroy();
  }
}