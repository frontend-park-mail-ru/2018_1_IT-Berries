import View from '../view/view.js';
import FormBlock from '../../common.blocks/form/form.js';
import FormMessageBlock from '../../common.blocks/form/__message/form__message.js';
import UsersModel from '../../models/users-model.js';

export default class SignupView extends View {
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

    this.eventBus.on('signup-error', this.onError.bind(this));
  }

  allowed() {
    return !UsersModel.isAuthorized();
  }

  async create() {
    super.create();

    this.formRoot = this.el.querySelector('.js-signup-form');
    this.formBlock = new FormBlock(this.formRoot, this.attrs.form, 'signup');
    this.formBlock.init();

    this.profileFormMessageRoot = this.el.querySelector('.js-form-message');
    this.formMessageBlock = new FormMessageBlock(this.profileFormMessageRoot);
    this.formMessageBlock.init();

    return this;
  }

  onError(err) {
    if (this.active) {
      this.formMessageBlock.setTextContent(err);
      this.formMessageBlock.show();
    }
  }
}