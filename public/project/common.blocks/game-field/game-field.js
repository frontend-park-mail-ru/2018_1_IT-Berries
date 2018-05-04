/** Class representing a scoreboard paginator block. */
export default class gameFieldBlock {

  /**
   * Create a game field block.
   */
  constructor(el = null, x = 8, y = 7) {
    this._el = el;
    this.x = x;
    this.y = y;
  }

  /**
   * Clear HTML component's body.
   */
  clear() {
    this._el.innerHTML = '';
  }

  /**
   * Render scoreboard paginator template in HTML component's body.
   */
  render() {
    const sizes = {x: this.x, y: this.y};
    const template = window.gameFieldTmplTemplate(sizes);
    this._el.innerHTML = template;

    /*
    const tables = document.getElementsByClassName('game-view__game-table');
    for (let i = 0; i < this.y; ++i) {
      tables[i].style.width = (this.x + i % 2) * 7 + 'vmin';
    }

    */
  }
}