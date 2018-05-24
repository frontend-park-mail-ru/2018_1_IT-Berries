import Engine from './engine';
import GameSocket from './game-socket';
import GameScene from '../game-scene';

export default class OnlineEngine extends Engine {

  constructor(gameScene, eventBus, profile, side) {
    super(null, eventBus, profile);
    this.side = side;
    this.onOpponentTurn = this.onOpponentTurn.bind(this);
    this.onConnect = this.onConnect.bind(this);
    let url = '';
    switch (window.location.hostname) {
    case 'localhost':
      url = 'ws://localhost:8080';
      break;
    case 'itberries-frontend.herokuapp.com':
      url = 'ws://itberries-frontend.herokuapp.com';

      //this._baseUrl = 'https://itberries-backend.herokuapp.com';
      break;
    case 'it-berries.neat.codes':
      url = 'wss://it-berries.neat.codes';
      break;
    }
    this.conectingPanel = document.getElementsByClassName('conecting-panel')[0];
    this.conectingPanel.style.visibility = 'visible';
    this.conectingPanelMsg = document.getElementsByClassName('conecting-panel__msg')[0];
    this.socket = new GameSocket(url + '/game', eventBus);
  }

  start() {
    super.start();
    document.getElementsByClassName('view-header__home')[0].addEventListener('click', () => {
      this.destroy();
    });
    this.eventBus.on(this.events.OPPONENT_TURN, this.onOpponentTurn);
    this.eventBus.on(this.events.CONNECTING, this.onConnect);
  }

  destroy() {
    super.destroy();
    this.eventBus.off(this.events.OPPONENT_TURN, this.onOpponentTurn);
    this.eventBus.off(this.events.CONNECTING, this.onConnect);
    this.gameScene.stopAllTimers();
  }

  onOpponentTurn(evt) {
    if (this.side === 'humans') {
      this.gameScene.stepUfoTo({x: evt.xval, y: evt.yval});
    } else {
      this.gameScene.setRocketByCoordinates(evt.xval, evt.yval);
    }
  }

  onGameStarted(payload) {
    this.conectingPanel.style.visibility = 'hidden';
    this.map = payload.cells;
    this.gameScene = new GameScene(this.map[0].length, this.map.length, this.eventBus, this.side);
    this.gameScene.setPanelName(0, payload.humansPlayer.name);
    this.gameScene.setPanelName(1, payload.ufoPlayer.name);
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        switch (this.map[i][j].owner) {
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
    let callingEvent;
    if (evt.reason === 'HUMANS_WIN') {
      callingEvent = this.events.HUMANS_WIN;
      this.gameScene.setPanelScore(0, evt.winner.score);
      this.gameScene.setPanelScore(1, evt.loser.score);
    } else if (evt.reason === 'UFO_WIN'){
      callingEvent = this.events.UFO_WIN;
      this.gameScene.setPanelScore(1, evt.winner.score);
      this.gameScene.setPanelScore(0, evt.loser.score);
    } else if (this.side === 'humans') {
      callingEvent = this.events.HUMANS_WIN;
      this.gameScene.setPanelScore(0, evt.winner.score);
      this.gameScene.setPanelScore(1, evt.loser.score);
    } else {
      callingEvent = this.events.UFO_WIN;
      this.gameScene.setPanelScore(1, evt.winner.score);
      this.gameScene.setPanelScore(0, evt.loser.score);
    }
    const endGamePanel = document.getElementsByClassName('end-game-panel')[0];
    endGamePanel.style.visibility = 'visible';
    const endGamePanelTittle = endGamePanel.getElementsByClassName('end-game-panel__tiitle')[0];
    let winnerNickName = evt.winner.name;
    endGamePanelTittle.innerHTML = winnerNickName + ' win!';
    endGamePanel.getElementsByClassName('end-game-panel__button')[0].addEventListener('click', () => {
      endGamePanel.style.visibility = 'hidden';
      let moves = document.getElementsByClassName('player-moves')[0];
      let score = document.getElementsByClassName('player-score')[0];
      this.eventBus.emit(callingEvent, {moves: Number(moves.innerHTML),
        score: Number(score.innerHTML),
        playAgainPath: '/mode'});
    });
    this.socket.close();
  }

  onHumansTurn(evt) {
    this.gameScene.restartTimer('humans');
    if (this.side === 'humans') {
      this.gameScene.playerHumanTurn();
    } else {
      this.socket.sendMessage('EVENTS.LOGIC.MOVE', this.makeMovePayload(evt));
    }
  }

  makeMovePayload(cell) {
    let rocketColumn = cell.parentNode.className.match(/\d+/g)[0];
    let rocketRow = cell.parentNode.parentNode.parentNode.parentNode.classList[0].match(/\d+/g)[0];
    return {
      from: {
        xval: rocketColumn,
        yval: rocketRow
      },
      to: {
        xval: rocketColumn,
        yval: rocketRow
      }
    };
  }

  onUfoTurn(evt) {
    this.gameScene.restartTimer('ufo');
    if (this.side === 'aliens') {
      this.gameScene.playerUfoTurn();
    } else {
      this.socket.sendMessage('EVENTS.LOGIC.MOVE', this.makeMovePayload(evt));
    }
  }

  onHumansWin(evt) {
    if (this.side === 'humans') {
      this.eventBus.emit('WIN_TOTALS', evt);
      this.eventBus.emit('win');
      this.destroy();
    } else {
      this.eventBus.emit('LOSE_TOTALS', evt);
      this.eventBus.emit('lose');
      this.destroy();
    }
  }

  onUfoWin(evt) {
    if (this.side === 'aliens') {
      this.eventBus.emit('WIN_TOTALS', evt);
      this.eventBus.emit('win');
      this.destroy();
    } else {
      this.eventBus.emit('LOSE_TOTALS', evt);
      this.eventBus.emit('lose');
      this.destroy();
    }
  }

  onConnect(evt) {
    this.conectingPanelMsg.innerHTML = evt;
  }
}