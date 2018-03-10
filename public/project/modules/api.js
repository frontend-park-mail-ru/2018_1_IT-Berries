;

export default class ApiModule {

  constructor(httpModule) {
    this._httpModule = httpModule;
  }

  get httpModule() {
    return this._httpModule;
  }

  set httpModule(httpModule) {
    this._httpModule = httpModule;
  }

  // Authorization and Users API methods

  loadProfile() {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchGet('/profile-data');
  }

  loadUsers(listSize = 5, listNumber = 1) {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchGet('/users?listSize=' + listSize + '&listNumber=' + listNumber);
  }

  loadMe() {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchGet('/me');
  }

  signupUser(user = {}) {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchPost({
      path: '/signup',
      formData: user
    });
  }

  loginUser(user = {}) {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchPost({
      path: '/login',
      formData: user
    });
  }

  logOut() {
    if (!this._httpModule) {
      return;
    }
    return this._httpModule.fetchGet('/logout');
  }

  changeUserData(user = {}) {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchPost({
      path: '/changeUserData',
      formData: user
    });
  }

};