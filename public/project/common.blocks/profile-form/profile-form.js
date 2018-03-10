;
export default class ProfileForm {
  constructor() {
    this.name = document.querySelector('.profile-form__username');
    this.email = document.querySelector('.profile-form__email');
    this.newPassword = document.querySelector('.profile-form__new-password');
    this.newPasswordRepeat = document.querySelector('.profile-form__new-password-repeat');
    this.currentPassword = document.querySelector('.profile-form__current-password');
    this.currentPassword.hidden = true;
    this.fields = document.getElementsByClassName('profile-form__input');
    Array.prototype.forEach.call(this.fields, (field) => {
      field.addEventListener('blur', () => {
        if (this.name.value != '' &&
          this.name.value != this.currentName ||
          this.email.value != '' &&
          this.email.value != this.currentEmail ||
          this.newPassword.value != '' ||
          this.newPasswordRepeat.value != '') {
          this.currentPassword.hidden = false;
        } else {
          this.currentPassword.hidden = true;
        }
      });
    });

  }

  get data() {
    return this._data;
  }

  set data(data = []) {
    this._data = data;
  }

  clear() {
    this.name.value = '';
    this.email.value = '';
    this.newPassword.value = '';
    this.newPasswordRepeat.value = '';
    this.currentPassword.value = '';
  }

  setOldValue() {
    this.name.value = this.data.username;
    this.email.value = this.data.email;
    this.currentName = this.data.username;
    this.currentEmail = this.data.email;
    this.currentPassword.hidden = true;
  }
};