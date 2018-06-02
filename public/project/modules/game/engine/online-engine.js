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
      url = 'ws://localhost:8080/api';
      break;
    case 'itberries-frontend.herokuapp.com':
      url = 'wss://itberries-frontend.herokuapp.com/api';

      //this._baseUrl = 'https://itberries-backend.herokuapp.com';
      break;
    case 'it-berries.neat.codes':
      url = 'wss://it-berries.neat.codes/api';
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
    if (this.gameScene !== undefined && this.gameScene !== null) {
      this.gameScene.stopAllTimers();
    }
    this.socket.close();
  }

  onOpponentTurn(evt) {
    if (this.side === 'humans') {
      this.gameScene.increaseTheNumberOfSteps(1);
      this.gameScene.stepUfoTo({x: evt.xval, y: evt.yval});
    } else {
      this.gameScene.increaseTheNumberOfSteps(0);
      this.gameScene.setRocketByCoordinates(evt.xval, evt.yval);
    }
  }

  onGameStarted(payload) {
    this.conectingPanel.style.visibility = 'hidden';
    document.getElementsByClassName('players-tables')[0].classList.remove('players-tables_hidden');
    this.map = payload.cells;
    this.gameScene = new GameScene(this.map[0].length, this.map.length, this.eventBus, this.side, 'online');
    this.gameScene.reset();
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
    this.gameScene.stopAllTimers();
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
      let moves = 0;
      let score = 0;
      if (this.side === 'humans') {
        moves = document.getElementsByClassName('player-moves')[0];
        score = document.getElementsByClassName('player-score')[0];
      } else {
        moves = document.getElementsByClassName('player-moves')[1];
        score = document.getElementsByClassName('player-score')[1];
      }
      this.eventBus.emit(callingEvent, {moves: Number(moves.innerHTML),
        score: Number(score.innerHTML),
        playAgainPath: '/mode'});
    });
    this.socket.close();
  }

  onHumansTurn(evt) {
    this.gameScene.player_turn = 1;
    this.gameScene.restartTimer('humans');
    document.getElementsByClassName('player-2-panel')[0].classList.remove('onTurn');
    document.getElementsByClassName('player-1-panel')[0].classList.add('onTurn');
    if (this.side === 'humans') {
      this.gameScene.playerHumanTurn();
    } else {
      if (evt !== undefined && evt !== null && evt.payload === undefined) {
        this.socket.sendMessage('EVENTS.LOGIC.MOVE', this.makeMovePayload(evt.target));
      } else if (evt.payload !== undefined && evt.payload !== null) {
        this.gameScene.opponentHumanTurn(evt);
      }
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
    this.gameScene.player_turn = 2;
    this.gameScene.restartTimer('ufo');
    document.getElementsByClassName('player-1-panel')[0].classList.remove('onTurn');
    document.getElementsByClassName('player-2-panel')[0].classList.add('onTurn');
    if (this.side === 'aliens') {
      this.gameScene.playerUfoTurn();
    } else {
      if (evt !== undefined && evt !== null && evt.payload === undefined) {
        this.socket.sendMessage('EVENTS.LOGIC.MOVE', this.makeMovePayload(evt.target));
      }  else if (evt.payload !== undefined && evt.payload !== null) {
        this.gameScene.opponentUfoTurn(evt);
      }
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