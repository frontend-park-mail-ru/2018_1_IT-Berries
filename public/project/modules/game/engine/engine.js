import gameEvents from './game-events.js';

export default class Engine {

  constructor(Scene, eventBus, profile) {
    this.player = profile;
    this.gameScene = Scene;
    this.eventBus = eventBus;
    this.events = gameEvents;
    this.onGameStarted = this.onGameStarted.bind(this);
    this.onGameFinished = this.onGameFinished.bind(this);
    this.onPlayer1Turn = this.onPlayer1Turn.bind(this);
    this.onPlayer2Turn = this.onPlayer2Turn.bind(this);
    this.onPlayer1Win = this.onPlayer1Win.bind(this);
    this.onPlayer2Win = this.onPlayer2Win.bind(this);
  }

  start() {
    this.eventBus.on(this.events.START_GAME, this.onGameStarted);
    this.eventBus.on(this.events.FINISH_GAME, this.onGameFinished);this.eventBus.on(this.events.GAME_STATE_CHANGED, this.onGameStateChanged);
    this.eventBus.on(this.events.PLAYER_1_TURN, this.onPlayer1Turn);
    this.eventBus.on(this.events.PLAYER_2_TURN, this.onPlayer2Turn);
    this.eventBus.on(this.events.PLAYER_1_WIN, this.onPlayer1Win);
    this.eventBus.on(this.events.PLAYER_2_WIN, this.onPlayer2Win);
  }

  destroy() {
    this.eventBus.off(this.events.START_GAME, this.onGameStarted);
    this.eventBus.off(this.events.FINISH_GAME, this.onGameFinished);
    this.eventBus.off(this.events.PLAYER_1_TURN, this.onPlayer1Turn);
    this.eventBus.off(this.events.PLAYER_2_TURN, this.onPlayer2Turn);
    this.eventBus.off(this.events.PLAYER_1_WIN, this.onPlayer1Win);
    this.eventBus.off(this.events.PLAYER_2_WIN, this.onPlayer2Win);
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