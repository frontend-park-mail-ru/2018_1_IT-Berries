import Router from '../../modules/router.js';
import eventBus from '../../modules/event-bus.js';

export default class View {
  constructor(templateName) {
    this.attrs = {};
    this.tmpl = templateName;
    this.router = new Router;
    this.eventBus = eventBus;
    this.active = false;

    this.el = document.createElement('div');
    this.hide();
  }

  hide() {
    this.el.setAttribute('hidden', 'hidden');
    this.active = false;
    return this;
  }

  show() {
    this.el.removeAttribute('hidden');
    this.active = true;
    return this;
  }

  render(attrs) {
    this.attrs = attrs || this.attrs;
    this.el.innerHTML = this.tmpl(this.attrs);
    return this;
  }

  async create(attrs) {
    return this
      .render(attrs)
      .show();
  }

  destroy() {
    this.hide();
    this.el.innerHTML = '';
    return this;
  }

  renderTo(root) {
    root.appendChild(this.el);
    return this;
  }

  allowed() {
    return true;
  }
}
