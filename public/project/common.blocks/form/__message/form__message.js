export default class FormMessageBlock {

  constructor(el) {
    this._el = el;
  }

  init() {
    this.clear();
    this.hide();
  }

  clear() {
    this._el.innerHTML = '';
  }

  hide() {
    this._el.setAttribute('hidden', 'true');
    return this;
  }

  show() {
    this._el.removeAttribute('hidden');
    return this;
  }

  setTextContent(text) {
    this._el.textContent = text;
  }

}
