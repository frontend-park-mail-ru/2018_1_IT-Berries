import View from '../view/view.js';
import FormBlock from '../../common.blocks/form/form.js';
import FormMessageBlock from '../../common.blocks/form/__message/form__message.js';
import UsersModel from '../../models/users-model.js';
import eventBus from '../../modules/event-bus.js';

export default class ProfileView extends View {

  constructor() {
    super('profileViewTmplTemplate');

    this.eventBus.on('change-profile-error', this.onError.bind(this));
  }

  render() {
    const profile = UsersModel.getCurrentUser();
    const attrs = {
      form: {
        type: 'profile',
        avatar: {
          inputType: 'file',
          inputName: 'avatar',
          inputPlaceholder: 'Path to your avatar'
        },
        fields: [
          {
            inputType: 'username',
            inputName: 'username',
            inputPlaceholder: 'Your username',
            inputValue: profile.username
          },
          {
            inputType: 'email',
            inputName: 'email',
            inputPlaceholder: 'Your email',
            inputValue: profile.email
          },
          {
            inputType: 'password',
            inputName: 'new_password',
            inputPlaceholder: 'Your new password',
          },
          {
            inputType: 'password',
            inputName: 'new_password_repeat',
            inputPlaceholder: 'Repeat your new password'
          },
          {
            inputType: 'password',
            inputName: 'current_password',
            inputPlaceholder: 'Current password'
          },
        ],
        submitText: 'Save profile'
      },
      profile: profile,
      additional_links: [
        {
          title: 'Log out',
          href: '/logout',
          event: 'logout'
        }
      ]
    };

    return super.render(attrs);
  }

  allowed() {
    return UsersModel.isAuthorized();
  }

  async create(attrs) {
    super.create(attrs);

    const avatar_input = document.getElementsByClassName('hide-input-avatar')[0];
    const avatar_button = document.getElementsByClassName('avatar-button')[0];
    const avatar_text = document.getElementsByClassName('avatar-text')[0];

    avatar_button.addEventListener('click', () => {
      avatar_input.click();
    });

    avatar_input.addEventListener('change', () => {
      avatar_text.innerHTML = avatar_input.value.split(/(\\|\/)/g).pop();
    });

    this.profileFormRoot = this.el.querySelector('.js-profile-form');
    this.formBlock = new FormBlock(this.profileFormRoot, this.attrs.form, 'change-profile');
    this.formBlock.init();

    this.profileFormMessageRoot = this.el.querySelector('.js-form-message');
    this.formMessageBlock = new FormMessageBlock(this.profileFormMessageRoot);
    this.formMessageBlock.init();

    this.eventBus.on('profile-changed', function () {
      this.render();
      this.formMessageBlock.clear();
      this.formMessageBlock.hide();
    }.bind(this));

    this.additionalLinks = [...this.el.querySelector('.js-additional-links').getElementsByTagName('a')];
    this.additionalLinks.forEach(function(link) {
      link.addEventListener('click', function (evt) {
        evt.preventDefault();
        eventBus.emit(link.name);
      }.bind(this));
    });

    return this;
  }

  onError(err) {
    if (this.active) {
      this.formMessageBlock.setTextContent(err);
      this.formMessageBlock.show();
    }
  }

}