define('LoginView', function (require) {
  const View = require('View');
  const FormBlock = require('FormBlock');
  const UsersModel = require('UsersModel');

  return class LoginView extends View {
    constructor() {
      super('loginViewTmplTemplate');
      this.attrs = {
        form: {
          fields: [
            {
              inputType: 'email',
              inputName: 'email',
              inputPlaceholder: 'Your email'
            },
            {
              inputType: 'password',
              inputName: 'password',
              inputPlaceholder: 'Your password'
            }
          ],
          submitText: 'Log in',
          additional_links: [
            {
              title: 'Sign up',
              href: '/signup'
            }
          ]
        }
      };

      this.bus.on('login-error', this.onerror.bind(this));
    }

    allowed() {
      return !UsersModel.isAuthorized();
    }

    create() {
      super.create();

      this.formRoot = this.el.querySelector('.js-login-form');
      this.FormBlock = new FormBlock(this.formRoot, this.attrs.form, this.onSubmit.bind(this));

      this.FormBlock.init();
      return this;
    }

    onerror(err) {
      if (this.active) {
        err.response.json().then(function(data) {
          console.error('Login error: ', data.error);
        });
      }
    }

    onSubmit(formdata) {
      this.bus.emit('login', formdata);
    }
  };
});
