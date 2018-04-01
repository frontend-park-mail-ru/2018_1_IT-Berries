/**
 * HTTP module.
 * @module modules/http
 */

define('HttpModule', function(require) {

  /** Class representing an HTTP module. */
  return class HttpModule {

    /**
     * Create an HTTP module.
     */
    constructor() {
      switch (window.location.hostname) {
      case 'localhost':
        this._baseUrl = 'http://localhost:8081';
        break;
      case 'itberries-frontend.herokuapp.com':
        this._baseUrl = 'https://itberries-backend.herokuapp.com';
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

      return fetch(url, options)
        .then(this._checkStatus)
        .then(this._parseResponseBody)
        .catch(error => {
          throw error;
        });
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

  };

});