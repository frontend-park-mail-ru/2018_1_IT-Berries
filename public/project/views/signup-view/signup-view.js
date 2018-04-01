define('SignupView', function (require) {
  const View = require('View');
  const FormBlock = require('FormBlock');
  const UsersModel = require('UsersModel');

  return class SignupView extends View {
    constructor() {
      super('signupViewTmplTemplate');
      this.attrs = {
        form: {
          fields: [
            {
              labelText: 'Введите ваш email',
              inputType: 'email',
              inputName: 'email',
              inputPlaceholder: 'Ваш email'
            },
            {
              labelText: 'Сколько вам лет?',
              inputType: 'number',
              inputName: 'age',
              inputPlaceholder: 'Возраст'
            },
            {
              labelText: 'Придумайте пароль',
              inputType: 'password',
              inputName: 'password',
              inputPlaceholder: 'Ваш пароль'
            }
          ],
          submitText: 'Зарегистрироваться'
        }
      };

      this.bus.on('signup-error', this.onerror.bind(this));
    }

    allowed() {
      return !UsersModel.isAuthorized();
    }

    create() {
      super.create();

      this.formRoot = this.el.querySelector('.js-signup-form');
      this.formBlock = new FormBlock(this.formRoot, this.attrs.form, this.onSubmit.bind(this));

      this.formBlock.init();
      return this;
    }

    onerror(err) {
      if (this.active) {
        console.error(err);
      }
    }

    onSubmit(formdata) {
      this.bus.emit('signup', formdata);
    }
  };
});
