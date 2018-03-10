;
import noop from '../utils/noop.js';

export default class HttpModule {

  doGet({url = '/', callback = noop} = {}) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) {
        return;
      }

      if (xhr.status === 200) {
        const responseText = xhr.responseText;
        try {
          const response = JSON.parse(responseText);
          callback(null, response);
        } catch (err) {
          console.error('doGet error: ', err);
          callback(err);
        }
      } else {
        callback(xhr);
      }
    };

    xhr.withCredentials = true;

    xhr.send();
  }

  doPost({url = '/', callback = noop, formData = {}} = {}) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) {
        return;
      }

      if (xhr.status < 300) {
        const responseText = xhr.responseText;

        try {
          const response = JSON.parse(responseText);
          callback(null, response);
        } catch (err) {
          console.error('doPost error: ', err);
          callback(err);
        }
      } else {
        callback(xhr);
      }
    };

    xhr.send(formData);
  }
};
