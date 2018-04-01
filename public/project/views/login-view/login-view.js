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
              labelText: 'Ваш email',
              inputType: 'email',
              inputName: 'email',
              inputPlaceholder: 'Ваш email'
            },
            {
              labelText: 'Ваш пароль',
              inputType: 'password',
              inputName: 'password',
              inputPlaceholder: 'Ваш пароль'
            }
          ],
          submitText: 'Войти'
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
        console.error(err);
      }
    }

    onSubmit(formdata) {
      this.bus.emit('login', formdata);
    }
  };
});
