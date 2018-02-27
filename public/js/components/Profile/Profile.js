(function () {
  
  class ProfileComponent {
    constructor(selector = 'body') {
      this._el = document.getElementsByClassName(selector);
    }

    get data() {
      return this._data;
    }

    set data(data = []) {
      this._data = data;
    }

    clear() {
      Array.prototype.forEach.call(this._el, function(profile) {
        profile.innerHTML = '';
      });
    }

    renderTmpl() {
      if (!this._data) {
        return;
      }

      const template = window.fest['js/components/Profile/Profile.tmpl'](this._data);
      Array.prototype.forEach.call(this._el, function(profile) {
        profile.innerHTML = template;
      });
    }

  }
  window.ProfileComponent = ProfileComponent;
  
})();