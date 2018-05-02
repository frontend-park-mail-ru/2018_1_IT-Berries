import View from '../view/view.js';
import UsersModel from '../../models/users-model.js';

export default class MenuView extends View {

  constructor() {
    super('menuViewTmplTemplate');
  }

  render() {
    const profile = UsersModel.getCurrentUser();
    const attrs = {
      navItems: [],
      profile
    };

    if (UsersModel.isAuthorized()) {
      attrs.navItems = [
        {
          button_style: 'main-button',
          type: 'play',
          href: '/game'
        },
        {
          button_style: 'secondary-button',
          type: 'login',
          href: '/profile'
        },
        {
          button_style: 'secondary-button',
          type: 'score-board',
          href: '/scoreboard'
        },
        {
          button_style: 'secondary-button',
          type: 'settings',
          href: '/settings'
        },
        {
          button_style: 'secondary-button',
          type: 'about',
          href: '/about'
        }
      ];
    } else {
      attrs.navItems = [
        {
          button_style: 'main-button',
          type: 'play',
          href: '/game'
        },
        {
          button_style: 'secondary-button',
          type: 'login',
          href: '/login'
        },
        {
          button_style: 'secondary-button',
          type: 'score-board',
          href: '/scoreboard'
        },
        {
          button_style: 'secondary-button',
          type: 'settings',
          href: '/settings'
        },
        {
          button_style: 'secondary-button',
          type: 'about',
          href: '/about'
        }
      ];
    }

    return super.render(attrs);
  }

}