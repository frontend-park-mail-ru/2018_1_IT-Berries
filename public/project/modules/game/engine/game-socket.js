export default class GameSocket {

  constructor(url, eventBus) {
    this.socket = new WebSocket('ws://' + url);
    this.socket.onmessage = (event) => {
      this.onMessage(event);
    };
  }

  onMessage(event) {
    document.writeln(event.data);
  }

}