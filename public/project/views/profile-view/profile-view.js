define('ProfileView', function (require) {
  const View = require('View');
  const UsersModel = require('UsersModel');

  return class ProfileView extends View {
    constructor() {
      super('profileViewTmplTemplate');
    }

    allowed() {
      return UsersModel.isAuthorized();
    }

    render() {
      const attrs = {
        form: {
          fields: [
            {
              labelText: 'Ваш username',
              inputType: 'username',
              inputName: 'username',
              inputPlaceholder: 'Ваш username'
            },
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
            },
            {
              labelText: 'Повторите ваш пароль',
              inputType: 'password',
              inputName: 'repeatPassword',
              inputPlaceholder: 'Повторите ваш пароль'
            }
          ],
          submitText: 'Изменить данные'
        },
        profile: UsersModel.getCurrentUser(),
        logoutLink: {
          title: 'Log out',
          href: '/logout'
        }
      };

      return super.render(attrs);
    }

    create(attrs) {
      console.log('profile create', attrs);
      super.create(attrs);
      const profileData = this.el.querySelector('.profile-view__data');
      UsersModel.loadProfile()
        .then(function (users) {
          this.scoreboardTable = new ScoreboardTableBlock({el: scoreboardTableRoot});
          this.scoreboardTable.data = users;
          this.scoreboardTable.render();

          this.scoreboardPaginator = new ScoreboardPaginatorBlock({el: scoreboardPaginationRoot});
          this.scoreboardPaginator.data = users;
          this.scoreboardPaginator.usersCount = users.length;
          this.scoreboardPaginator.render(this.listSize, this.listNumber, this.create.bind(this));

        }.bind(this))
        .catch(console.error);
    }
  };
});
