import View from '../view/view.js';
import FormBlock from '../../common.blocks/form/form.js';
import FormMessageBlock from '../../common.blocks/form/__message/form__message.js';
import UsersModel from '../../models/users-model.js';
import loginViewTemplate from './login-view.tmpl.pug';

export default class LoginView extends View {

  constructor() {
    super(loginViewTemplate);
    this.attrs = {
      form: {
        type: 'login',
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
            title: 'Signup',
            href: '/signup'
          },
          {
            title: 'Forget password?',
            href: '/signup'
          }
        ]
      }
    };

    this.eventBus.on('login-error', this.onError.bind(this));
  }

  allowed() {
    return !UsersModel.isAuthorized();
  }

  async create() {
    super.create();

    this.formRoot = this.el.querySelector('.js-login-form');
    this.FormBlock = new FormBlock(this.formRoot, this.attrs.form, 'login');
    this.FormBlock.init();

    this.profileFormMessageRoot = this.el.querySelector('.js-form-message');
    this.formMessageBlock = new FormMessageBlock(this.profileFormMessageRoot);
    this.formMessageBlock.init();

    if (!navigator.onLine) {
      this.formMessageBlock.setTextContent('You are offline!');
      this.formMessageBlock.show();
    }

    return this;
  }

  onError(err) {
    if (this.active) {
      this.formMessageBlock.setTextContent(err);
      this.formMessageBlock.show();
    }
  }

}