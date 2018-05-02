import View from '../view/view.js';

export default class LoseGameView extends View {

  constructor() {
    super('loseGameViewTmplTemplate');
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