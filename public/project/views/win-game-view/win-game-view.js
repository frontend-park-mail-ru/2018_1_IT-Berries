import View from '../view/view.js';

export default class WinGameView extends View {

  constructor() {
    super('winGameViewTmplTemplate');
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {};

    return super.render(attrs);
  }

}