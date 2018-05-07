import UsersModel from '../../../models/users-model';
import gameEvents from './game-events.js';

export default class GameSocket {

  constructor(url, eventBus) {
    this.socket = new WebSocket('ws://' + url);
    this.eventBus = eventBus;
    this.events = gameEvents;
    this.socket.onmessage = (event) => {
      this.onMessage(event);
    };
    this.socket.onopen = (event) => {
      this.readyForJoinGame();
    };
    this.socket.onclose = (event) => {
      alert('Connection closed with messegae: ' + event.data);
    };
  }

  readyForJoinGame() {
    let joinGameMessage = {side: UsersModel.getCurrentUser().side};
    joinGameMessage.event = 'MESSAGES.JOINGAME';
    this.socket.send(JSON.stringify(joinGameMessage));
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    switch (message.event) {
    case 'EVENTS.GAME.START':
      this.eventBus.emit(this.events.START_GAME, message.payload.cells);
      break;
    case 'EVENTS.GAME.TURN':
      if ( message.payload.turn === 'human') {
        this.eventBus.emit(this.events.PLAYER_1_TURN);
      } else {
        this.eventBus.emit(this.events.PLAYER_2_TURN);
      }
      break;
    default:
      alert('New message: ' + event.data);
    }
  }

}