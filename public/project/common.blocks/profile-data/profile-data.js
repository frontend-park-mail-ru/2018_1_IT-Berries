/** Class representing a profile data component. */
export default class ProfileComponent {

  /**
   * Create a profile data component.
   */
  constructor(selector = 'body') {
    this._el = document.getElementsByClassName(selector);
  }

  /**
   * Get the profile data.
   * @return {Object} The profile data value.
   */
  get data() {
    return this._data;
  }

  /**
   * Set the profile data.
   * @param {Object} data - The data value.
   */
  set data(data = {}) {
    this._data = data;
  }

  /**
   * Clear HTML component's body.
   */
  clear() {
    Array.prototype.forEach.call(this._el, function(profile) {
      profile.innerHTML = '';
    });
  }

  /**
   * Render profile data template in HTML component's body.
   */
  renderTmpl() {
    if (!this._data) {
      return;
    }

    const template = window.profileDataTmplTemplate(this._data);
    Array.prototype.forEach.call(this._el, function(profile) {
      profile.innerHTML = template;
    });
  }
}