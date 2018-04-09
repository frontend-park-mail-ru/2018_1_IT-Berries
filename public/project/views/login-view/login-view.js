define('LoginView', function (require) {
  const View = require('View');
  const FormBlock = require('FormBlock');
  const FormMessageBlock = require('FormMessageBlock');
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

    async create() {
      super.create();

      this.formRoot = this.el.querySelector('.js-login-form');
      this.FormBlock = new FormBlock(this.formRoot, this.attrs.form, this.onSubmit.bind(this));
      this.FormBlock.init();

      this.profileFormMessageRoot = this.el.querySelector('.js-form-message');
      this.formMessageBlock = new FormMessageBlock(this.profileFormMessageRoot);
      this.formMessageBlock.init();

      this.bus.on('login-error', this.onerror.bind(this));

      return this;
    }

    onerror(err) {
      if (this.active) {
        this.formMessageBlock.setTextContent(err);
        this.formMessageBlock.show();
      }
    }

    onSubmit(formdata) {
      this.bus.emit('login', formdata);
    }
  };
});
