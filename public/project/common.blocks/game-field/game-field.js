import gameFieldTemplate from './game-field.tmpl.pug';
import settings from '../../modules/settings';

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
    const sizes = {x: this.x, y: this.y, theme: settings.getCurrentThemeOrVpn()};
    this._el.innerHTML = gameFieldTemplate(sizes);
  }
}