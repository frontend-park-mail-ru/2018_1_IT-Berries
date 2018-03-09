;
export default class ProfileComponent {
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

    const template = window.profileTmplTemplate(this._data);
    Array.prototype.forEach.call(this._el, function(profile) {
      profile.innerHTML = template;
    });
  }

};