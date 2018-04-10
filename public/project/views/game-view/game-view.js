import View from '../view/view.js';

export default class GameView extends View {

  constructor() {
    super('gameViewTmplTemplate');
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {};

    return super.render(attrs);
  }

}