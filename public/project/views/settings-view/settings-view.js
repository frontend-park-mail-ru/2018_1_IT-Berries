import View from '../view/view.js';
import setSettingsEffectsListeners from './settings-effects.js';
import UsersModel from '../../models/users-model.js';
import settingsViewTemplate from './settings-view.tmpl.pug';
import SelectBoxBlock from '../../common.blocks/select-box/select-box';
import eventBus from '../../modules/event-bus';
import settings from '../../modules/settings';

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
          theme_selected: settings.isCurrentTheme('1') ? 'selected' : false,
        },
        {
          theme_name: 'PurplePlanet',
          theme_id: 2,
          theme_selected: settings.isCurrentTheme('2') ? 'selected' : false
        }
      ],
      vpn: {
        checked: settings.isVpnEnabled() ? 'checked' : false
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

    const musicInput = document.getElementsByClassName('music-input')[0];
    if (localStorage && localStorage.getItem('musicVol') !== null && localStorage.getItem('musicVol') !== undefined) {
      musicInput.value = localStorage.getItem('musicVol') * 100;
    }
    if (localStorage && localStorage.getItem('musicIsOn') === 'false') {
      document.getElementsByClassName('music-icon')[0].style.backgroundImage = 'url(../../../images/musicOff.png)';
    }

    return returnParam;
  }

  onChangeTheme(newThemeVal) {
    this._application.classList.remove('application_theme-' + settings.getCurrentTheme());
    this._application.classList.add('application_theme-' + newThemeVal);
    settings.setCurrentTheme(newThemeVal);
  }

  onChangeVpn() {
    if (this.checked) {
      SettingsView.changeVpnModeStyles(true);
      settings.setVpn(true);
    } else {
      SettingsView.changeVpnModeStyles(false);
      settings.setVpn(false);
    }
  }

  static changeVpnModeStyles(doEnable) {
    const isEnable = settings.isVpnEnabled();
    if (doEnable && !isEnable) {
      let application = document.getElementsByClassName('application')[0];
      application.classList.remove('application_theme-' + settings.getCurrentTheme());
      application.classList.add('application_theme-vpn');
    } else if (!doEnable && isEnable) {
      let application = document.getElementsByClassName('application')[0];
      application.classList.remove('application_theme-vpn');
      application.classList.add('application_theme-' + settings.getCurrentTheme());
    }
  }
}