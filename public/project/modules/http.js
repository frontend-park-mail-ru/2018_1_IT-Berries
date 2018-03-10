;

/**
 * HTTP module.
 * @module modules/http
 */

/** Class representing an HTTP module. */
export default class HttpModule {

  /**
   * Create an HTTP module.
   * @param {string} baseUrl='' - The base url for http requests.
   */
  constructor(baseUrl = '') {
    this._baseUrl = baseUrl;
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
   * Check status of http response.
   * @access private
   * @param {Response} response - fetch api response object to check.
   * @return {Response} The response value.
   * @throws {Error} Will throw an error if the response status is not Success (2xx).
   */
  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  /**
   * Parse response body.
   * @access private
   * @param {Response} response - fetch api response object to parse.
   * @return {Promise} A promise that resolves with the result of parsing the response text as JSON or text.
   */
  _parseResponseBody(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
    } else {
      return response.text();
    }
  }

  /**
   * Provides async HTTP GET request with CORS supported.
   * @access public
   * @param {string} path='/' - path for http request.
   * @return {Promise} A promise that resolves with the result of HTTP GET request.
   */
  fetchGet(path = '/') {
    const url = this._baseUrl + path;
    const options = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    };

    return fetch(url, options)
      .then(this._checkStatus)
      .then(this._parseResponseBody)
      .catch( error => {
        throw error;
      });

  }

  /**
   * Provides async HTTP POST request with CORS supported.
   * @access public
   * @param {Object} object={} - the object of request params.
   * @param {string} object.path='/' - path for http request.
   * @param {string} object.formData={} - the form data for request body.
   * @return {Promise} A promise that resolves with the result of HTTP POST request.
   */
  fetchPost({path = '/', formData = {}}) {
    const url = this._baseUrl + path;
    const options = {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: formData
    };
    return fetch(url, options)
      .then(this._checkStatus)
      .then(this._parseResponseBody)
      .catch( error => {
        throw error;
      });
  }
};
