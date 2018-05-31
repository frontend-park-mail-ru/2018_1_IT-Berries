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
    this._currentThemeVal = 1;
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
          theme_selected: (this._currentThemeVal === 1) ? 'selected' : false,
        },
        {
          theme_name: 'PurplePlanet',
          theme_id: 2,
          theme_selected: (this._currentThemeVal === 2) ? 'selected' : false
        }
      ]
    };
    const returnParam = super.render(attrs);

    setSettingsEffectsListeners();

    eventBus.on('change-theme', this.onChangeTheme.bind(this));

    this.themeSelectBoxRoot = this.el.querySelector('.js-theme-select-box');
    this.selectBoxBlock = new SelectBoxBlock(this.themeSelectBoxRoot, this.attrs.themes, 'change-theme');
    this.selectBoxBlock.init();

    return returnParam;
  }

  onChangeTheme(newThemeVal) {
    this._application.classList.remove('application_theme' + this._currentThemeVal);
    this._application.classList.add('application_theme' + newThemeVal);
    this._currentThemeVal = newThemeVal;
  }
}