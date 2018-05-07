export default class GameSocket {

  constructor(url, eventBus) {
    this.socket = new WebSocket('ws://' + url);
    this.socket.onmessage = (event) => {
      this.onMessage(event);
    };
    this.socket.onopen = (event) => {
      alert('Connection established');
      this.readyForJoinGame();
    };
    this.socket.onclose = (event) => {
      alert('Connection closed with messegae: ' + event.data);
    };
  }

  readyForJoinGame() {
    this.socket.send('waiting for opponent');
  }

  onMessage(event) {
    alert('New message: ' + event.data);
  }

}