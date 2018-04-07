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
              inputType: 'text',
              inputName: 'username',
              inputPlaceholder: 'Your username'
            },
            {
              inputType: 'email',
              inputName: 'email',
              inputPlaceholder: 'Your email'
            },
            {
              inputType: 'password',
              inputName: 'password',
              inputPlaceholder: 'Your password'
            },
            {
              inputType: 'password',
              inputName: 'password_repeat',
              inputPlaceholder: 'Repeat your password'
            },
            {
              inputType: 'file',
              inputName: 'avatar',
              inputPlaceholder: 'Path to your avatar'
            }
          ],
          submitText: 'Sign up',
          additional_links: [
            {
              title: 'I already have an account',
              href: '/login'
            }
          ]
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
        err.response.json().then(function(data) {
          // const registrationValidationField = document.getElementsByClassName('registration-form__validation')[0];
          // registrationValidationField.textContent = json.error;
          console.error('Signup error: ', data.error);
        });

      }
    }

    onSubmit(formdata) {
      this.bus.emit('signup', formdata);
    }
  };
});
