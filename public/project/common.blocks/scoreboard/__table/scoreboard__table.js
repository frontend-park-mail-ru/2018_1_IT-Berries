import scoreboardTableTemplate from './scoreboard__table.tmpl.pug';
import scoreboardTbodyTemplate from './scoreboard__tbody.tmpl.pug';

/** Class representing a scoreboard table block. */
export default class ScoreboardTableBlock {

  /**
   * Create a scoreboard table block.
   * @param {string} selector - selector of element where scoreboard will be created.
   */
  constructor({ el = null }) {
    this._el = el;
  }

  /**
   * Get the scoreboard data.
   * @return {Object} The data value.
   */
  get data() {
    return this._data;
  }

  /**
   * Set the scoreboard data.
   * @param {Object} data - The data value.
   */
  set data(data = {}) {
    this._data = data;
  }

  /**
   * Clear HTML component's body.
   */
  clear() {
    this._el.innerHTML = '';
  }

  /**
   * Render scoreboard data template in HTML block's body.
   */
  render() {
    if (!this._data) {
      return;
    }
    this._el.innerHTML = scoreboardTableTemplate();
    this._scoreboardTableBodyRoot = this._el.querySelector('.js-scoreboard-tbody');
    this.renderData();
  }

  /**
   * Render scoreboard data template in scoreboard table body.
   */
  renderData() {
    if (!this._scoreboardTableBodyRoot) {
      return;
    }
    const data = {'data' : this._data};
    this._scoreboardTableBodyRoot.innerHTML = scoreboardTbodyTemplate(data);
  }

}