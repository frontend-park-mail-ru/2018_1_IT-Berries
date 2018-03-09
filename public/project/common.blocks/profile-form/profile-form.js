;
export default class ProfileForm {
  constructor() {
    this.name = document.querySelector('.profile-form__username');
    this.email = document.querySelector('.profile-form__email');
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
  }

  setOldValue() {
    this.name.value = this.data.username;
    this.email.value = this.data.email;
  }
};