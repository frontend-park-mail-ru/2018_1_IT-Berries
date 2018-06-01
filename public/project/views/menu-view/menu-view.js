import View from '../view/view.js';
import UsersModel from '../../models/users-model.js';
import menuViewTemplate from './menu-view.tmpl.pug';
import settings from '../../modules/settings';

export default class MenuView extends View {

  constructor() {
    super(menuViewTemplate);
  }

  render() {
    const profile = UsersModel.getCurrentUser();
    const attrs = {
      navItems: [],
      profile,
      theme: settings.getCurrentThemeOrVpn(),
      header: settings.getHeader()
    };

    if (UsersModel.isAuthorized()) {
      attrs.navItems = [
        {
          button_style: 'main-button',
          type: 'play',
          href: '/mode'
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
          href: '/side/offline-mode'
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