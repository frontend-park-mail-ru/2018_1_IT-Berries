define('ProfileView', function (require) {
  const View = require('View');
  const bus = require('bus');
  const FormBlock = require('FormBlock');
  const FormMessageBlock = require('FormMessageBlock');
  const UsersModel = require('UsersModel');

  return class ProfileView extends View {
    constructor() {
      super('profileViewTmplTemplate');
    }

    render() {
      const profile = UsersModel.getCurrentUser();
      const attrs = {
        form: {
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
            {
              inputType: 'file',
              inputName: 'avatar',
              inputPlaceholder: 'Path to your avatar'
            }
          ],
          submitText: 'Change profile'
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

      this.profileFormRoot = this.el.querySelector('.js-profile-form');
      this.formBlock = new FormBlock(this.profileFormRoot, this.attrs.form, this.onSubmit.bind(this));
      this.formBlock.init();

      this.profileFormMessageRoot = this.el.querySelector('.js-form-message');
      this.formMessageBlock = new FormMessageBlock(this.profileFormMessageRoot);
      this.formMessageBlock.init();

      this.bus.on('profile-changed', function () {
        this.render();
        this.formMessageBlock.clear();
        this.formMessageBlock.hide();
      }.bind(this));

      this.bus.on('change-profile-error', this.onerror.bind(this));

      this.additionalLinks = [...this.el.querySelector('.js-additional-links').getElementsByTagName('a')];
      this.additionalLinks.forEach(function(link) {
        link.addEventListener('click', function (evt) {
          evt.preventDefault();
          bus.emit(link.name);
        }.bind(this));
      });

      return this;
    }

    onerror(err) {
      if (this.active) {
        this.formMessageBlock.setTextContent(err);
        this.formMessageBlock.show();
      }
    }

    onSubmit(formdata) {
      this.bus.emit('change-profile', formdata);
    }
  };
});
