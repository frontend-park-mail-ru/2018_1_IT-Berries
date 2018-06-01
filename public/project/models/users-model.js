import httpModule from '../modules/http.js';
import eventBus from '../modules/event-bus.js';

export let currentUser = null;

export default class UsersModel {

  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.score = data.score;
    this.avatar = data.avatar;
    this.profileBarAvatar = '/avatar?' + Math.random() + '&avatar=' + data.avatar;
  }

  static validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Проверяет авторизацию текущего пользователя
   * если пользователь авторизован, возвращает его модель
   * иначе - возвращает null
   * @return Object response
   */
  static async loadMe() {

    let response = {
      ok: false,
      data: null,
      error: null
    };

    if (currentUser) {
      response.data = currentUser;
      return response;
    }

    const resp = await httpModule.fetchGet({
      path: '/me'
    });

    if (resp.status === 401) {
      currentUser = null;
      response.ok = true;
      return response;
    }

    response.data = await resp.json();

    if (resp.status >= 400) {
      response.error = response.data.error;
      return response;
    }

    response.ok = true;
    currentUser = new UsersModel(response.data);
    return response;
  }

  /**
   * Проверка, авторизован ли пользователь
   * @return {boolean}
   */
  static isAuthorized() {
    return !!currentUser;
  }

  /**
   * Возвращает модель текущего пользователя
   * @return {UsersModel|null}
   */
  static getCurrentUser() {
    return currentUser;
  }

  /**
   * Авторизация пользователя
   * @param {FormData} formData
   * @return Object response
   */
  static async login(formData) {

    let response = {
      ok: false,
      data: null,
      error: null
    };

    let password = '';
    let email = '';

    for(const dataPair of formData.entries()) {
      if (dataPair[0] === 'password') {
        password = dataPair[1];
      } else if (dataPair[0] === 'email') {
        email = dataPair[1];
      }
    }

    if (!this.validateEmail(email)) {
      response.error = 'Enter your email!';
      return response;
    }

    if (password === '') {
      response.error = 'Enter your password!';
      return response;
    }

    const resp = await httpModule.fetchPost({
      path: '/login',
      formData: formData
    });
    response.data = await resp.json();

    if (resp.status >= 400) {
      response.error = response.data.error;
      return response;
    }

    response.ok = true;
    currentUser = response.data;
    currentUser.profileBarAvatar = '/avatar?' + Math.random() + '&avatar=' + currentUser.avatar;
    return response;

    //  .then(() => UsersModel.loadMe());
  }

  /**
   * Деавторизация пользователя
   * @return {Promise<UsersModel>}
   */
  static async logout() {

    currentUser = null;

    await httpModule.fetchDelete({
      path: '/logout'
    });
  }

  /**
   * Регистрация пользователя
   * @param {FormData} formData
   * @return {Promise<Object>} response
   */
  static async signup(formData) {

    let response = {
      ok: false,
      data: null,
      error: null
    };

    let password = '';
    let password_repeat = '';
    let email = '';
    let username = '';
    let avatar = '';

    for(const dataPair of formData.entries()) {
      if (dataPair[0] === 'password') {
        password = dataPair[1];
      } else if (dataPair[0] === 'password_repeat') {
        password_repeat = dataPair[1];
      } else if (dataPair[0] === 'email') {
        email = dataPair[1];
      } else if (dataPair[0] === 'username') {
        username = dataPair[1];
      } else if (dataPair[0] === 'avatar') {
        avatar = dataPair[1].name;
      }
    }

    if (username === '') {
      response.error = 'Username is invalid';
      return response;
    }

    if (!this.validateEmail(email)) {
      response.error = 'Email is invalid';
      return response;
    }

    if (password !== password_repeat) {
      response.error = 'Passwords do not match';
      return response;
    }

    if (!password.match(/^\S{4,}$/)) {
      response.error = 'Password must be longer than 3 characters';
      return response;
    }

    // Отправляем в виде поля avatar имя аватара
    formData.append('avatar', avatar);

    const resp = await httpModule.fetchPost({
      path: '/registration',
      formData: formData
    });
    response.data = await resp.json();

    if (resp.status >= 400) {
      response.error = response.data.error;
      return response;
    }

    response.ok = true;
    currentUser = response.data;
    currentUser.profileBarAvatar = '/avatar?' + Math.random() + '&avatar=' + currentUser.avatar;
    return response;

    //  .then(() => UsersModel.loadMe());
  }

  /**
   * Загружает список всех пользователей
   * @return {Promise<Object>}
   */
  static async loadList(listSize = 5, listNumber = 1) {

    let response = {
      ok: false,
      data: null,
      error: null
    };

    const resp = await httpModule.fetchGet({
      path: '/users/scoreboard?listSize=' + listSize + '&listNumber=' + listNumber
    });
    response.data = await resp.json();

    if (resp.status >= 400) {
      response.error = response.data.error;
      return response;
    }

    response.ok = true;
    response.data.scorelist = response.data.scorelist.map(item => new UsersModel(item));
    return response;
  }

  /**
   * Изменяет профиль пользователя
   * @return Object response
   */
  static async changeProfile(formData) {

    let response = {
      ok: false,
      data: null,
      error: null
    };

    let currentPassword = '';
    let newPassword = '';
    let newPasswordRepeat = '';
    let email = '';
    let username = '';
    let avatar = '';

    for(const dataPair of formData.entries()) {
      if (dataPair[0] === 'new_password') {
        newPassword = dataPair[1];
      } else if (dataPair[0] === 'new_password_repeat') {
        newPasswordRepeat = dataPair[1];
      } else if (dataPair[0] === 'email') {
        email = dataPair[1];
      } else if (dataPair[0] === 'username') {
        username = dataPair[1];
      } else if (dataPair[0] === 'current_password') {
        currentPassword = dataPair[1];
      } else if (dataPair[0] === 'avatar') {
        avatar = dataPair[1].name;
      }
    }

    if (email !== '' && !email.match(/@/)) {
      response.error = 'Email is invalid';
      return response;
    }

    if (newPassword !== '' && !newPassword.match(/^\S{4,}$/)) {
      response.error = 'New password must be longer than 3 characters';
      return response;
    }

    if (newPassword !== newPasswordRepeat) {
      response.error = 'New passwords do not match';
      return response;
    }

    if (email !== currentUser.email ||
      username !== currentUser.username ||
      newPassword !== '') {
      if (currentPassword === '') {
        response.error = 'You should confirm your current password!';
        return response;
      }
    }

    // Отправляем в виде поля avatar имя аватара
    formData.append('avatar', avatar);

    const resp = await httpModule.fetchPost({
      path: '/me',
      formData: formData
    });
    response.data = await resp.json();

    if (resp.status >= 400) {
      response.error = response.data.error;
      return response;
    }

    currentUser = new UsersModel(response.data);
    eventBus.emit('profile-changed');
    response.ok = true;
    response.data = currentUser;
    return response;
  }

}