define('UsersModel', function (require) {
  const httpModule = require('httpModule');

  let currentUser = null;

  return class UsersModel {
    constructor(data) {
      this.id = data.id;
      this.username = data.username;
      this.email = data.email;
      this.score = data.score;
    }

    /**
     * Проверяет авторизацию текущего пользователя
     * если пользователь авторизован, возвращает его модель
     * иначе - возвращает null
     * @return {Promise<UsersModel|null>}
     */
    static auth() {
      if (currentUser) {
        return Promise.resolve(currentUser);
      }

      return httpModule.fetchGet({
        path: '/me/profile'
      })
        .then((response) => {
          currentUser = new UsersModel(response);
          console.log('current user: ', currentUser);
          return currentUser;
        })
        .catch((err) => {
          console.log('auth me err: ', err);
          if (!err.status || err.status === 401) {
            return null;
          }
          console.log('auth err: ', err);
          throw err;
        });
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
     * @return {Promise<UsersModel>}
     */
    static login(formData) {

      let password = '';
      let email = '';

      for(const dataPair of formData.entries()) {
        if (dataPair[0] === 'password') {
          password = dataPair[1];
        } else if (dataPair[0] === 'email') {
          email = dataPair[1];
        }
      }

      if (email === '') {
        throw Error('Email is invalid');
      }

      if (!password.match(/^\S{4,}$/)) {
        throw Error('Password must be longer than 3 characters');
      }

      return httpModule.fetchPost({
        path: '/login',
        formData: formData
      })
        .then(() => UsersModel.auth());
    }

    /**
     * Деавторизация пользователя
     * @return {Promise<UsersModel>}
     */
    static logout() {
      return httpModule.fetchGet({
        path: '/logout'
      })
        .then(() => UsersModel.auth());
    }

    /**
     * Регистрация пользователя
     * @param {FormData} formData
     * @return {Promise<UsersModel>}
     */
    static signup(formData) {

      let password = '';
      let password_repeat = '';
      let email = '';
      let username = '';

      for(const dataPair of formData.entries()) {
        if (dataPair[0] === 'password') {
          password = dataPair[1];
        } else if (dataPair[0] === 'password_repeat') {
          password_repeat = dataPair[1];
        } else if (dataPair[0] === 'email') {
          email = dataPair[1];
        } else if (dataPair[0] === 'username') {
          username = dataPair[1];
        }
      }

      if (username === '') {
        throw Error('Username is invalid');
      }

      if (email === '') {
        throw Error('Email is invalid');
      }

      if (password !== password_repeat) {
        throw Error('Passwords do not match');
      }

      if (!password.match(/^\S{4,}$/)) {
        throw Error('Password must be longer than 3 characters');
      }

      return httpModule.fetchPost({
        path: '/registration',
        formData: formData
      })
        .then(() => UsersModel.auth());
    }

    /**
     * Загружает список всех пользователей
     * @return {Promise<UsersModel[]>}
     */
    static loadList(listSize = 5, listNumber = 1) {
      return httpModule.fetchGet({
        path: '/users/scoreboard?listSize=' + listSize + '&listNumber=' + listNumber
      })
        .then((response) => response.scorelist.map(item => new UsersModel(item)));
    }

  };
});
