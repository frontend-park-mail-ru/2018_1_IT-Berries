import View from '../view/view.js';

export default class GameModeView extends View {

  constructor() {
    super('gameModeViewTmplTemplate');
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {};

    return super.render(attrs);
  }

}