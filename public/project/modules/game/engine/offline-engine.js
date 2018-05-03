import Engine from './engine.js';
import Map from './map.js';
import Bot from './bot.js';

export default class OfflineEngine extends Engine{

  constructor(gameScene, eventBus, profile) {
    super(gameScene, eventBus, profile);
  }

  start() {
    document.getElementsByClassName('view-header__home')[0].addEventListener('click', () => {
      this.destroy();
    });
    super.start();
    this.eventBus.emit(this.events.START_GAME);
  }

  onGameStarted(evt) {
    this.gameScene.reset();
    this.map = new Map(this.gameScene).map;
    this.bot = new Bot(this.map, this.gameScene.getUfoStartPosition());
    if (this.player != null) {
      if (this.player.username.length > 20) {
        this.gameScene.setPanelName(0, this.player.username.substr(0, 20) + '...');
      } else {
        this.gameScene.setPanelName(0, this.player.username);
      }

    } else {
      this.gameScene.setPanelName(0, 'Player');
    }
    this.gameScene.setPanelName(1, 'Bot');
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
    this.gameScene.addmove(0);
    let rocketcolumn = evt.parentNode.className.match(/\d+/g)[0];
    let rocketrow = evt.parentNode.parentNode.parentNode.parentNode.classList[0].match(/\d+/g)[0];
    this.map[rocketrow][rocketcolumn].isRocket = true;
    let newStep = this.bot.searchWay();
    if (newStep === 'No way!') {
      this.eventBus.emit(this.events.FINISH_GAME, this.events.PLAYER_1_WIN);
    } else {
      await this.gameScene.stepUfoTo(newStep);
      this.eventBus.emit(this.events.PLAYER_1_TURN);
      this.gameScene.addmove(1);
    }

  }

  onGameFinished(callingEvents) {
    const endGamePanel = document.getElementsByClassName('end-game-panel')[0];
    endGamePanel.style.visibility = 'visible';
    const endGamePanelTittle = endGamePanel.getElementsByClassName('end-game-panel__tiitle')[0];
    let winnerNickName = '';
    if (callingEvents === this.events.PLAYER_1_WIN) {
      winnerNickName = this.gameScene.getPanelName(0);
    } else {
      winnerNickName = this.gameScene.getPanelName(1);
    }
    endGamePanelTittle.innerHTML = winnerNickName + ' win!';
    endGamePanel.getElementsByClassName('end-game-panel__button')[0].addEventListener('click', () => {
      endGamePanel.style.visibility = 'hidden';
      let moves = document.getElementsByClassName('player-moves')[0];
      let score = document.getElementsByClassName('player-score')[0];
      this.eventBus.emit(callingEvents, {moves: Number(moves.innerHTML), score: Number(score.innerHTML)});
    });
  }

  onPlayer1Win(evt) {
    this.eventBus.emit('WIN_TOTALS', evt);
    this.eventBus.emit('win');
    this.destroy();
  }

  onPlayer2Win(evt) {
    this.eventBus.emit('LOSE_TOTALS', evt);
    this.eventBus.emit('lose');
    this.destroy();
  }
}