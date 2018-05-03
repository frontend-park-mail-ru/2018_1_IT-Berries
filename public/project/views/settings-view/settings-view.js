import View from '../view/view.js';
import settingsEffects from './settings.js';
import UsersModel from '../../models/users-model.js';

export default class SettingsView extends View {
  constructor() {
    super('settingsViewTmplTemplate');
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
      ]
    };
    const reternParam = super.render(attrs);
    settingsEffects();
    return reternParam;
  }
}