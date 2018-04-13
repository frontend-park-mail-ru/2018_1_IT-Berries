import View from '../view/view.js';

export default class LoseGameView extends View {

  constructor() {
    super('loseGameViewTmplTemplate');
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {};

    return super.render(attrs);
  }

}