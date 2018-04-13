import View from '../view/view.js';

export default class SettingsView extends View {
  constructor() {
    super('settingsViewTmplTemplate');
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {
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

    return super.render(attrs);
  }
}