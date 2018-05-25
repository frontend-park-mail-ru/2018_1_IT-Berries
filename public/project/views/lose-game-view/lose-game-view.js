import View from '../view/view.js';
import loseGameViewTemplate from './lose-game-view.tmpl.pug';

export default class LoseGameView extends View {

  constructor() {
    super(loseGameViewTemplate);
    this.attrs = {};
    this.eventBus.on('LOSE_TOTALS', async (gameTotals) => {
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