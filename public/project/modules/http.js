/**
 * HTTP module.
 * @module modules/http
 */

/** Class representing an HTTP module. */
class HttpModule {

  /**
   * Create an HTTP module.
   */
  constructor() {
    switch (window.location.hostname) {
    case 'localhost':
      this._baseUrl = 'http://localhost:8080/api';
      break;
    case 'itberries-frontend.herokuapp.com':
      this._baseUrl = 'https://itberries-backend.herokuapp.com/api';

      // this._baseUrl = 'https://itberries-frontend.herokuapp.com/api';
      break;
    case 'it-berries.neat.codes':
      this._baseUrl = 'https://it-berries.neat.codes/api';
      break;
    }
  }

  /**
   * Get the baseUrl value.
   * @return {string} The baseUrl value.
   */
  get baseUrl() {
    return this._baseUrl;
  }

  /**
   * Set the baseUrl value.
   * @param {string} baseUrl - The base url for http requests.
   */
  set baseUrl(baseUrl) {
    this._baseUrl = baseUrl;
  }

  /**
   * Provides async HTTP request with CORS supported.
   * @access public
   * @param {Object} object={} - the object of request params.
   * @param {string} object.method='GET' - http method of request.
   * @param {string} object.path='/' - path of http request.
   * @param {FormData} object.formData={} - the form data for request body.
   * @return {Promise} A promise that resolves with the result of HTTP request.
   */
  _fetchHttpRequest({method = 'GET', path = '/', formData = {}}) {
    const url = this._baseUrl + path;
    const options = {
      method: method,
      mode: 'cors',
      credentials: 'include',
    };

    if (method === 'POST' || method === 'PUT') {
      options.body = formData;
    }

    return fetch(url, options);
  }

  /**
   * Provides async HTTP GET request.
   * @access public
   * @param {Object} object={} - the object of request params.
   * @param {string} object.path='/' - path of http request.
   * @return {Promise} A promise that resolves with the result of HTTP GET request.
   */
  fetchGet({path = '/'} = {}) {
    return this._fetchHttpRequest({
      method: 'GET',
      path: path
    });
  }

  /**
   * Provides async HTTP POST request.
   * @access public
   * @param {Object} object={} - the object of request params.
   * @param {string} object.path='/' - path of http request.
   * @param {FormData} object.formData={} - the form data for request body.
   * @return {Promise} A promise that resolves with the result of HTTP POST request.
   */
  fetchPost({path = '/', formData = {}} = {}) {
    return this._fetchHttpRequest({
      method: 'POST',
      path: path,
      formData: formData
    });
  }

  /**
   * Provides async HTTP PUT request.
   * @access public
   * @param {Object} object={} - the object of request params.
   * @param {string} object.path='/' - path of http request.
   * @param {FormData} object.formData={} - the form data for request body.
   * @return {Promise} A promise that resolves with the result of HTTP PUT request.
   */
  fetchPut({path = '/', formData = {}} = {}) {
    return this._fetchHttpRequest({
      method: 'PUT',
      path: path,
      formData: formData
    });
  }

  /**
   * Provides async HTTP PATCH request.
   * @access public
   * @param {Object} object={} - the object of request params.
   * @param {string} object.path='/' - path of http request.
   * @param {FormData} object.formData={} - the form data for request body.
   * @return {Promise} A promise that resolves with the result of HTTP PATCH request.
   */
  fetchPatch({path = '/', formData = {}} = {}) {
    return this._fetchHttpRequest({
      method: 'PATCH',
      path: path,
      formData: formData
    });
  }

  /**
   * Provides async HTTP DELETE request.
   * @access public
   * @param {Object} object={} - the object of request params.
   * @param {string} object.path='/' - path of http request.
   * @return {Promise} A promise that resolves with the result of HTTP DELETE request.
   */
  fetchDelete({path = '/'} = {}) {
    return this._fetchHttpRequest({
      method: 'DELETE',
      path: path
    });
  }

}

let httpModule = new HttpModule();
export default httpModule;