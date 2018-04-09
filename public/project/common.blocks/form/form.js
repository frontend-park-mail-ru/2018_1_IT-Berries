// import eventBus from '../../modules/bus';

export default class FormBlock {

  constructor(el, attrs, callback) {
    this._el = el;
    this._attrs = attrs;
    this._callback = callback;

    this.form = null;
  }

  init() {
    this.form = this._el.querySelector('.js-form');

    this.form.addEventListener('submit', function (evt) {
      evt.preventDefault();

      const formData = new FormData(this.form);
      this._callback(formData);

    }.bind(this));
  }

  clear() {
    this._el.innerHTML = '';
  }

  render(attrs) {
    this._attrs = attrs || this._attrs;
    this._el.innerHTML = window.formTmplTemplate(this._attrs);
  }

}