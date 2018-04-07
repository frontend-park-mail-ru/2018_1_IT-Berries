define('ScoreboardTableBlock', function(require) {

  /** Class representing a scoreboard table block. */
  return class ScoreboardTableBlock {

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
      const data = {'data' : this._data};
      const template = window.scoreboardTableTmplTemplate(data);
      this._el.innerHTML = template;
    }

  };
});