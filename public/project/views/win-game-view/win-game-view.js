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
    let returnValue = super.render(attrs);
    document.getElementsByClassName('end-game-board__control')[0].addEventListener('click', () => {
      document.getElementsByClassName('toMenu')[0].click();
    });
    document.getElementsByClassName('end-game-board__control')[1].addEventListener('click', () => {
      document.getElementsByClassName('newGame')[0].click();
    });

    return returnValue;
  }

}