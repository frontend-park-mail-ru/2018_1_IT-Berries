import View from '../view/view.js';

export default class SettingsView extends View {
  constructor() {
    super('settingsViewTmplTemplate');
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {};

    return super.render(attrs);
  }
}