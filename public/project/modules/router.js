/**
 * Router module.
 * @module router/
 */

define('Router', function (require) {

  return class Router {
    constructor(root) {
      if (Router.__instance) {
        return Router.__instance;
      }

      this.root = root;
      this.map = {};
      this.active = null;

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
    open(path) {
      const view = this.map[path];
      if (!view || view === this.active || !view.allowed()) {
        return this;
      }

      if (this.active) {
        this.active.destroy();
        this.active = null;
      }

      this.active = view.create();
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }

      return this;
    }

    /**
     * Start Router
     * @return {Router}
     */
    start() {
      window.addEventListener('popstate', function () {
        this.open(window.location.pathname);
      }.bind(this));

      this.root.addEventListener('click', function (evt) {
        if (evt.target.tagName.toLowerCase() === 'a') {
          evt.preventDefault();
          this.open(evt.target.pathname);
        }
      }.bind(this));

      this.open(window.location.pathname);
    }
  };

});
