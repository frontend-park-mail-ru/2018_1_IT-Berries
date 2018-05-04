import View from '../view/view.js';
import settingsEffects from './settings.js';
import UsersModel from '../../models/users-model.js';
import settingsViewTemplate from './settings-view.tmpl.pug';

export default class SettingsView extends View {
  constructor() {
    super(settingsViewTemplate);
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
          setup_name: 'Music::',
          type: 'music'
        }
      ]
    };
    const returnParam = super.render(attrs);
    settingsEffects();
    return returnParam;
  }
}