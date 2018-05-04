import View from '../view/view.js';
import winGameViewTemplate from './win-game-view.tmpl.pug';

export default class WinGameView extends View {

  constructor() {
    super(winGameViewTemplate);
    this.attrs = {};
    this.eventBus.on('WIN_TOTALS', async (gameTotals) => {
      this.attrs = gameTotals;
    });
  }

  allowed() {
    return true;
  }

  render() {
    let returnValue = super.render(this.attrs);
    document.getElementsByClassName('end-game-board__control')[0].addEventListener('click', () => {
      document.getElementsByClassName('toMenu')[0].click();
    });
    document.getElementsByClassName('end-game-board__control')[1].addEventListener('click', () => {
      document.getElementsByClassName('newGame')[0].click();
    });

    return returnValue;
  }

}