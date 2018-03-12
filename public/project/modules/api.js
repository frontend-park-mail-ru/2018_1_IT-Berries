/**
 * API module.
 * @module modules/api
 */

/** Class representing an API module. */
export default class ApiModule {

  /**
   * Create an API module.
   * @param {HttpModule} httpModule - The http module for api requests.
   */
  constructor(httpModule) {
    this._httpModule = httpModule;
  }

  /**
   * Get the httpModule value.
   * @return {HttpModule} The http module used for api requests.
   */
  get httpModule() {
    return this._httpModule;
  }

  /**
   * Set the httpModule value.
   * @param {HttpModule} httpModule - The http module for api requests.
   */
  set httpModule(httpModule) {
    this._httpModule = httpModule;
  }

  // Authorization and Users API methods

  /**
   * Fetch api request to load user profile.
   * @access public
   * @return {Promise} A promise that resolves with the result of API request.
   */
  loadProfile() {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchGet({
      path: '/me/profile'
    });
  }

  /**
   * Fetch api request to load users.
   * @access public
   * @return {Promise} A promise that resolves with the result of API request.
   */
  loadUsers(listSize = 5, listNumber = 1) {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchGet({
      path: '/users/scoreboard?listSize=' + listSize + '&listNumber=' + listNumber
    });
  }

  /**
   * Fetch api request to load information about current user.
   * @access public
   * @return {Promise} A promise that resolves with the result of API request.
   */
  loadMe() {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchGet({
      path: '/me'
    });
  }

  /**
   * Fetch api request sign up new user.
   * @access public
   * @param {FormData} user={} - New user data.
   * @return {Promise} A promise that resolves with the result of API request.
   */
  registrationUser(user = {}) {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchPost({
      path: '/registration',
      formData: user
    });
  }

  /**
   * Fetch api request log in user.
   * @access public
   * @param {FormData} user={} - User data to log in.
   * @return {Promise} A promise that resolves with the result of API request.
   */
  loginUser(user = {}) {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchPost({
      path: '/login',
      formData: user
    });
  }

  /**
   * Fetch api request log out current user.
   * @access public
   * @return {Promise} A promise that resolves with the result of API request.
   */
  logOut() {
    if (!this._httpModule) {
      return;
    }
    return this._httpModule.fetchGet({
      path: '/logout'
    });
  }

  /**
   * Fetch api request to change user profile information.
   * @access public
   * @param {FormData} user={} - Changed user profile data.
   * @return {Promise} A promise that resolves with the result of API request.
   */
  changeUserData(user = {}) {
    if (!this._httpModule) {
      return;
    }

    return this._httpModule.fetchPost({
      path: '/me/profile',
      formData: user
    });
  }

}