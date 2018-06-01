import gameEvents from './game-events.js';
import Game from '../game';

export default class GameSocket {

  constructor(url, eventBus) {
    this.socket = new WebSocket(url);
    this.eventBus = eventBus;
    this.events = gameEvents;
    this.socket.onmessage = (event) => {
      this.onMessage(event);
    };
    this.socket.onopen = (event) => {
      this.readyForJoinGame();
    };
    this.socket.onclose = (event) => {

      /*alert('Connection closed with messegae: ' + event.data);*/
    };
  }

  close() {
    this.socket.close();
  }

  sendMessage(event, payload) {
    let joinGameMessage = {payload: payload};
    joinGameMessage.event = event;
    this.socket.send(JSON.stringify(joinGameMessage));
  }

  readyForJoinGame() {
    this.sendMessage('MESSAGES.JOINGAME', Game.getSide());
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    switch (message.event) {
    case 'EVENTS.GAME.START':
      this.eventBus.emit(this.events.START_GAME, message.payload);
      break;
    case 'EVENTS.GAME.TURN':
      if ( message.payload.turn === 'human') {
        this.eventBus.emit(this.events.HUMANS_TURN, message);
      } else {
        this.eventBus.emit(this.events.UFO_TURN, message);
      }
      break;
    case 'EVENTS.LOGIC.SCORE' :
      this.eventBus.emit(this.events.SCORE_CHANGE, message.payload);
      break;
    case 'EVENTS.LOGIC.MOVE':
      this.eventBus.emit(this.events.OPPONENT_TURN, message.payload.to);
      break;
    case 'EVENTS.GAME.RESULT':
      this.eventBus.emit(this.events.FINISH_GAME, message.payload);
      break;
    case 'EVENTS.SERVICE.CONNECT':
      this.eventBus.emit(this.events.CONNECTING, message.payload);
      break;
    default:
      break;
    }
  }

}