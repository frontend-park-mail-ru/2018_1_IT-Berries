define('MenuView', function (require) {
  const View = require('View');
  const UsersModel = require('UsersModel');

  return class MenuView extends View {
    constructor() {
      super('menuViewTmplTemplate');
    }

    render() {
      const attrs = {
        navItems: []
      };

      if (UsersModel.isAuthorized()) {
        attrs.navItems = [
          {
            title: 'Start game',
            href: '/game-mode'
          },
          {
            title: 'Profile',
            href: '/profile'
          },
          {
            title: 'Scoreboard',
            href: '/scoreboard'
          },
          {
            title: 'Settings',
            href: '/settings'
          },
          {
            title: 'About',
            href: '/about'
          }
        ];
      } else {
        attrs.navItems = [
          {
            title: 'Start game',
            href: '/game-mode'
          },
          {
            title: 'Log in',
            href: '/login'
          },
          {
            title: 'Scoreboard',
            href: '/scoreboard'
          },
          {
            title: 'Settings',
            href: '/settings'
          },
          {
            title: 'About',
            href: '/about'
          }
        ];
      }

      return super.render(attrs);
    }
  };
});
