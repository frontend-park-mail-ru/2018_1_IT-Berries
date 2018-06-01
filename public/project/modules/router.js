/**
 * Router module.
 * @module router/
 */

export default class Router {

  constructor(root, unallowed = '/') {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.root = root;
    this.map = {};
    this.active = null;
    this.unallowed = unallowed;
    this.notfound = '/404';

    Router.__instance = this;
  }

  /**
   * Add new route
   * @param {string} path - path for View
   * @param {View} View - View that need to be opened on path route
   * @return {Router}
   */
  add(path, View) {
    this.map[path] = new View().renderTo(this.root);
    return this;
  }

  /**
   * Go to route with received path
   * @param {string} path - path to go
   * @return {Router}
   */
  async open(path) {
    const view = this.map[path];
    if (view === this.active) {
      return this;
    }

    if (!view) {
      await this.open(this.notfound);
      return this;
    }

    if (!view.allowed()) {
      await this.open(this.unallowed);
      return this;
    }

    if (this.active) {
      this.active.destroy();
      this.active = null;
    }

    this.active = await view.create(path);
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    return this;
  }

  /**
   * Start Router
   * @return {Router}
   */
  async start() {
    window.addEventListener('popstate', async function () {
      await this.open(window.location.pathname);
    }.bind(this));

    this.root.addEventListener('click', async function (evt) {
      if (evt.target.tagName.toLowerCase() === 'a') {
        evt.preventDefault();
        await this.open(evt.target.pathname);
      }
    }.bind(this));

    await this.open(window.location.pathname);
  }

}