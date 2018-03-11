/** Class representing a profile form component. */
export default class ProfileForm {

  /**
   * Create a profile form component.
   * Constructor set event listener for hidden current password field.
   */
  constructor() {
    this._fields = new Map;
    this._fields.set('name', document.querySelector('.profile-form__username'));
    this._fields.set('email', document.querySelector('.profile-form__email'));
    this._fields.set('newPassword', document.querySelector('.profile-form__new-password'));
    this._fields.set('newPasswordRepeat', document.querySelector('.profile-form__new-password-repeat'));
    this._fields.set('currentPassword', document.querySelector('.profile-form__current-password'));
    this._fields.get('currentPassword').hidden = true;
    for(let field of this._fields.values()) {
      field.addEventListener('blur', () => {
        if (this._fields.get('name').value !== '' &&
          this._fields.get('name').value !== this.currentName ||
          this._fields.get('email').value !== '' &&
          this._fields.get('email').value !== this.currentEmail ||
          this._fields.get('newPassword').value !== '' ||
          this._fields.get('newPasswordRepeat').value !== '') {
          this._fields.get('currentPassword').hidden = false;
        } else {
          this._fields.get('currentPassword').hidden = true;
        }
      });
    }
  }

  /**
   * Get the profile data.
   * @return {Object} The data value.
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
   * Clear input fields of profile form.
   */
  clear() {
    this._fields.get('name').value = '';
    this._fields.get('email').value = '';
    this._fields.get('newPassword').value = '';
    this._fields.get('newPasswordRepeat').value = '';
    this._fields.get('currentPassword').value = '';
  }

  /**
   * Set current username and email in profile form.
   */
  setOldValue() {
    this._fields.get('name').value = this.data.username;
    this._fields.get('email').value = this.data.email;
    this.currentName = this.data.username;
    this.currentEmail = this.data.email;
    this._fields.get('currentPassword').hidden = true;
  }
}