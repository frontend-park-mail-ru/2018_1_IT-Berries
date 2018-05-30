import View from '../view/view.js';
import FormBlock from '../../common.blocks/form/form.js';
import FormMessageBlock from '../../common.blocks/form/__message/form__message.js';
import UsersModel from '../../models/users-model.js';
import eventBus from '../../modules/event-bus.js';
import profileViewTemplate from './profile-view.tmpl.pug';

export default class ProfileView extends View {

  constructor() {
    super(profileViewTemplate);

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
            inputPlaceholder: 'Repeat new password'
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

    super.render(attrs);
    this.updateListeners();

    return this;
  }

  allowed() {
    return UsersModel.isAuthorized();
  }

  async create(attrs) {
    super.create(attrs);

    this.eventBus.on('profile-changed', function () {
      this.render();
      this.formMessageBlock.clear();
      this.formMessageBlock.hide();
    }.bind(this));

    return this;
  }

  onError(err) {
    if (this.active) {
      this.formMessageBlock.setTextContent(err);
      this.formMessageBlock.show();
    }
  }

  updateListeners() {
    const avatar_input = this.el.getElementsByClassName('hide-input-avatar')[0];
    const avatar_button = this.el.getElementsByClassName('avatar-button')[0];

    avatar_button.addEventListener('click', () => {
      avatar_input.click();
    });

    avatar_input.addEventListener('change', () => {
      avatar_button.innerText = 'Change avatar...';
      avatar_button.classList.add('avatar-button_choosed');
    });

    this.profileFormRoot = this.el.querySelector('.js-profile-form');
    this.formBlock = new FormBlock(this.profileFormRoot, this.attrs.form, 'change-profile');
    this.formBlock.init();

    this.profileFormMessageRoot = this.el.querySelector('.js-form-message');
    this.formMessageBlock = new FormMessageBlock(this.profileFormMessageRoot);
    this.formMessageBlock.init();

    this.additionalLinks = [...this.el.querySelector('.js-additional-links').getElementsByTagName('a')];
    this.additionalLinks.forEach(function(link) {
      link.addEventListener('click', function (evt) {
        evt.preventDefault();
        eventBus.emit(link.name);
      }.bind(this));
    });
  }
}