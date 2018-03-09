;
import noop from '../utils/noop.js';
import HttpModule from './http.js';

export default class ApiModule {

  constructor() {
    this._httpModule = new HttpModule();
  }

  get httpModule() {
    return this._httpModule;
  }

  set httpModule(httpModule) {
    this._httpModule = httpModule;
  }

  // Authorization and Users API methods

  loadProfile(callback = noop) {
    if (!this._httpModule) {
      return;
    }

    this._httpModule.doGet({
      url: '/profile',
      callback: callback
    });
  }

  loadUsers(callback = noop) {
    if (!this._httpModule) {
      return;
    }

    this.httpModule.doGet({
      url: '/users',
      callback
    });
  }

  loadMe(callback = noop) {
    if (!this._httpModule) {
      return;
    }

    this.httpModule.doGet({
      url: '/me',
      callback
    });
  }

  signupUser(user = {}, callback = noop) {
    if (!this._httpModule) {
      return;
    }

    this.httpModule.doPost({
      url: '/signup',
      callback: callback,
      formData: user
    });
  }

  loginUser(user = {}, callback = noop) {
    if (!this._httpModule) {
      return;
    }

    this.httpModule.doPost({
      url: '/login',
      callback: callback,
      formData: user
    });
  }

  logOut(callback = noop) {
    if (!this._httpModule) {
      return;
    }

    this.httpModule.doGet({
      url: '/logout',
      callback: callback
    });
  }

};