import View from '../view/view.js';
import setSettingsEffectsListeners from './settings.js';
import UsersModel from '../../models/users-model.js';
import settingsViewTemplate from './settings-view.tmpl.pug';
import SelectBoxBlock from '../../common.blocks/select-box/select-box';
import eventBus from '../../modules/event-bus';

export default class SettingsView extends View {
  constructor() {
    super(settingsViewTemplate);
    this._application = document.getElementsByClassName('application')[0];
  }

  allowed() {
    return true;
  }

  render() {
    const profile = UsersModel.getCurrentUser();
    const attrs = {
      profile,
      navItems: [
        {
          setup_name: 'Sound:',
          type: 'sound'
        },
        {
          setup_name: 'Music:',
          type: 'music'
        }
      ],
      themes: [
        {
          theme_name: 'PinkPlanet',
          theme_id: 1,
          theme_selected: this.isCurrentTheme('1') ? 'selected' : false,
        },
        {
          theme_name: 'PurplePlanet',
          theme_id: 2,
          theme_selected: this.isCurrentTheme('2') ? 'selected' : false
        }
      ],
      vpn: {
        checked: this.isVpnEnabled() ? 'checked' : false
      }
    };
    const returnParam = super.render(attrs);

    setSettingsEffectsListeners();

    eventBus.on('change-theme', this.onChangeTheme.bind(this));

    this.themeSelectBoxRoot = this.el.querySelector('.js-theme-select-box');
    this.selectBoxBlock = new SelectBoxBlock(this.themeSelectBoxRoot, this.attrs.themes, 'change-theme');
    this.selectBoxBlock.init();

    this.vpnSwither = this.el.getElementsByClassName('checker')[0];
    this.vpnSwither.addEventListener('click', this.onChangeVpn.bind(this.vpnSwither));

    return returnParam;
  }

  onChangeTheme(newThemeVal) {
    this._application.classList.remove('application_theme-' + localStorage.getItem('theme'));
    this._application.classList.add('application_theme-' + newThemeVal);
    localStorage.setItem('theme', newThemeVal);
  }

  onChangeVpn() {
    if (this.checked) {
      SettingsView.changeVpnModeStyles(true);
      localStorage.setItem('vpn', 'true');
    } else {
      SettingsView.changeVpnModeStyles(false);
      localStorage.setItem('vpn', 'false');
    }
  }

  isCurrentTheme(themeVal) {
    if (localStorage) {
      const currentTheme = localStorage.getItem('theme');
      return (currentTheme && currentTheme === themeVal);
    } else {
      return false;
    }
  }

  isVpnEnabled() {
    if (localStorage) {
      return (localStorage.getItem('vpn') === 'true');
    } else {
      return false;
    }
  }

  static changeVpnModeStyles(doEnable) {
    const isEnable = localStorage.getItem('vpn');
    if (doEnable && isEnable !== 'true') {
      let application = document.getElementsByClassName('application')[0];
      application.classList.remove('application_theme-' + localStorage.getItem('theme'));
      application.classList.add('application_theme-vpn');
    } else if (!doEnable && isEnable === 'true') {
      let application = document.getElementsByClassName('application')[0];
      application.classList.remove('application_theme-vpn');
      application.classList.add('application_theme-' + localStorage.getItem('theme'));
    }
  }
}