import View from '../view/view.js';
import UsersModel from '../../models/users-model.js';

export default class MenuView extends View {

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
          button_style: 'main-button',
          button_type: 'play-button',
          icon: 'play-icon',
          href: '/game-mode'
        },
        {
          button_style: 'secondary-button',
          button_type: 'login-button',
          icon: 'login-icon',
          href: '/profile'
        },
        {
          button_style: 'secondary-button',
          button_type: 'score-board-button',
          icon: 'score-board-icon',
          href: '/scoreboard'
        },
        {
          button_style: 'secondary-button',
          button_type: 'settings-button',
          icon: 'settings-icon',
          href: '/settings'
        },
        {
          button_style: 'secondary-button',
          button_type: 'about-button',
          icon: 'about-icon',
          href: '/about'
        }
      ];
    } else {
      attrs.navItems = [
        {
          button_style: 'main-button',
          button_type: 'play-button',
          icon: 'play-icon',
          href: '/game-mode'
        },
        {
          button_style: 'secondary-button',
          button_type: 'login-button',
          icon: 'login-icon',
          href: '/login'
        },
        {
          button_style: 'secondary-button',
          button_type: 'score-board-button',
          icon: 'score-board-icon',
          href: '/scoreboard'
        },
        {
          button_style: 'secondary-button',
          button_type: 'settings-button',
          icon: 'settings-icon',
          href: '/settings'
        },
        {
          button_style: 'secondary-button',
          button_type: 'about-button',
          icon: 'about-icon',
          href: '/about'
        }
      ];
    }

    return super.render(attrs);
  }

}