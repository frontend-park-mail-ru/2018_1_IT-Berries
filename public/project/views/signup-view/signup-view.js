import View from '../view/view.js';
import FormBlock from '../../common.blocks/form/form.js';
import FormMessageBlock from '../../common.blocks/form/__message/form__message.js';
import UsersModel from '../../models/users-model.js';
import signupViewTemplate from './signup-view.tmpl.pug';

export default class SignupView extends View {
  constructor() {
    super(signupViewTemplate);
    this.attrs = {
      form: {
        type: 'signup',
        avatar: {
          inputType: 'file',
          inputName: 'avatar',
          inputPlaceholder: 'Path to your avatar'
        },
        fields: [
          {
            inputType: 'text',
            inputName: 'username',
            inputPlaceholder: 'Your username'
          },
          {
            inputType: 'text',
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
    
    const avatar_input = document.getElementsByClassName('hide-input-avatar')[0];
    const avatar_button = document.getElementsByClassName('avatar-button')[0];

    avatar_button.addEventListener('click', () => {
      avatar_input.click();
    });

    avatar_input.addEventListener('change', () => {
      avatar_button.innerText = 'Change avatar...';
      avatar_button.classList.add('avatar-button_choosed');
    });

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