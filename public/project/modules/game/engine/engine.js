import gameEvents from './game-events.js';

export default class Engine {

  constructor(Scene, eventBus) {
    this.gameScene = Scene;
    this.eventBus = eventBus;
    this.events = gameEvents;
    this.onGameStarted = this.onGameStarted.bind(this);
    this.onGameFinished = this.onGameFinished.bind(this);
    this.onPlayer1Turn = this.onPlayer1Turn.bind(this);
    this.onPlayer2Turn = this.onPlayer2Turn.bind(this);
  }

  start() {
    this.eventBus.on(this.events.START_GAME, this.onGameStarted);
    this.eventBus.on(this.events.FINISH_GAME, this.onGameFinished);this.eventBus.on(this.events.GAME_STATE_CHANGED, this.onGameStateChanged);
    this.eventBus.on(this.events.PLAYER_1_TURN, this.onPlayer1Turn);
    this.eventBus.on(this.events.PLAYER_2_TURN, this.onPlayer2Turn);
  }

  destroy() {
    this.eventBus.off(this.events.START_GAME, this.onGameStarted);
    this.eventBus.off(this.events.FINISH_GAME, this.onGameFinished);
    this.eventBus.off(this.events.PLAYER_1_TURN, this.onPlayer1Turn);
    this.eventBus.off(this.events.PLAYER_2_TURN, this.onPlayer2Turn);
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
}