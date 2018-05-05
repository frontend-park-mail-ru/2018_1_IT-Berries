import View from '../view/view.js';
import gameModeViewTemplate from './game-mode-view.tmpl.pug';

export default class GameModeView extends View {

  constructor() {
    super(gameModeViewTemplate);
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {};

    return super.render(attrs);
  }

}