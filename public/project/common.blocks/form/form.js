import eventBus from '../../modules/event-bus.js';
import formTemplate from './form.tmpl.pug';

export default class FormBlock {

  constructor(el, attrs, onSubmitEvent) {
    this._el = el;
    this._attrs = attrs;
    this._onSubmitEvent = onSubmitEvent;

    this.form = null;
  }

  init() {
    this.form = this._el.querySelector('.js-form');

    this.form.addEventListener('submit', function (evt) {
      evt.preventDefault();

      const formData = new FormData(this.form);
      eventBus.emit(this._onSubmitEvent, formData);

    }.bind(this));
  }

  clear() {
    this._el.innerHTML = '';
  }

  render(attrs) {
    this._attrs = attrs || this._attrs;
    this._el.innerHTML = formTemplate(this._attrs);
  }

}