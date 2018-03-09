;
export default class ScoreboardComponent {
  constructor(selector = 'body') {
    this._el = document.querySelector(selector);
  }

  get data() {
    return this._data;
  }

  set data(data = []) {
    this._data = data;
  }

  clear() {
    this._el.innerHTML = '';
  }

  renderTmpl() {
    if (!this._data) {
      return;
    }
    const data = {'data' : this._data};
    const template = window.scoreboardTmplTemplate(data);
    this._el.innerHTML = template;
  }

};