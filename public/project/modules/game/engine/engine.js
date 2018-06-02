import gameEvents from './game-events.js';

export default class Engine {

  constructor(Scene, eventBus, profile) {
    this.player = profile;
    this.gameScene = Scene;
    this.eventBus = eventBus;
    this.events = gameEvents;
    this.onGameStarted = this.onGameStarted.bind(this);
    this.onGameFinished = this.onGameFinished.bind(this);
    this.onHumansTurn = this.onHumansTurn.bind(this);
    this.onUfoTurn = this.onUfoTurn.bind(this);
    this.onHumansWin = this.onHumansWin.bind(this);
    this.onUfoWin = this.onUfoWin.bind(this);
    document.getElementsByClassName('view-header__head')[0].classList.add('game-platform-checker');
  }

  start() {
    this.eventBus.on(this.events.START_GAME, this.onGameStarted);
    this.eventBus.on(this.events.FINISH_GAME, this.onGameFinished);
    this.eventBus.on(this.events.HUMANS_TURN, this.onHumansTurn);
    this.eventBus.on(this.events.UFO_TURN, this.onUfoTurn);
    this.eventBus.on(this.events.HUMANS_WIN, this.onHumansWin);
    this.eventBus.on(this.events.UFO_WIN, this.onUfoWin);
  }

  destroy() {
    this.eventBus.off(this.events.START_GAME, this.onGameStarted);
    this.eventBus.off(this.events.FINISH_GAME, this.onGameFinished);
    this.eventBus.off(this.events.HUMANS_TURN, this.onHumansTurn);
    this.eventBus.off(this.events.UFO_TURN, this.onUfoTurn);
    this.eventBus.off(this.events.HUMANS_WIN, this.onHumansWin);
    this.eventBus.off(this.events.UFO_WIN, this.onUfoWin);
    document.getElementsByClassName('view-header__head')[0].classList.remove('game-platform-checker');
  }

  onGameStarted(evt) {
    throw new Error('This method must be overridden');
  }

  onGameFinished(evt) {
    throw new Error('This method must be overridden');
  }

  onHumansTurn(evt) {
    throw new Error('This method must be overridden');
  }

  onUfoTurn(evt) {
    throw new Error('This method must be overridden');
  }

  onHumansWin(evt) {
    throw new Error('This method must be overridden');
  }

  onUfoWin(evt) {
    throw new Error('This method must be overridden');
  }
}