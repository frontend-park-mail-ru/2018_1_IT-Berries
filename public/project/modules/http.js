;

export default class HttpModule {

  constructor(baseUrl = '') {
    this._baseUrl = baseUrl;
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  parseJSON(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
    } else {
      return response.text();
    }
  }

  fetchGet(path = '/') {
    const url = this._baseUrl + path;
    const options = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    };

    return fetch(url, options)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .catch( error => {
        throw error;
      });

  }

  fetchPost({path = '/', formData = {}}) {
    const url = this._baseUrl + path;
    const options = {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: formData
    };
    return fetch(url, options)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .catch( error => {
        throw error;
      });
  }
};
