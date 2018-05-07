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
    const attrs = {
      planets: [
        {
          name: 'single-player',
          innerText: 'Singleplayer'
        },
        {
          name: 'multi-player',
          innerText: 'Multiplayer'
        }
      ]
    };

    const returnedValue = super.render(attrs);


    this.arrows = this.el.getElementsByClassName('game-mode-view__super-selector');
    this.singlePlayerPLanet = this.el.getElementsByClassName('game-mode-view__single-player-planet')[0];
    this.multiPlayerPlanet = this.el.getElementsByClassName('game-mode-view__multi-player-planet')[0];
    this.status = 'single';
    for (let i = 0; i < this.arrows.length; i++) {
      this.arrows[i].addEventListener('click', () => {
        this.chooseMode();
      });
    }

    return returnedValue;
  }

  chooseMode() {
    if (this.status === 'single') {
      this.singlePlayerPLanet.style.visibility = 'hidden';
      this.multiPlayerPlanet.style.visibility = 'visible';
      this.status = 'multi';
    } else {
      this.multiPlayerPlanet.style.visibility = 'hidden';
      this.singlePlayerPLanet.style.visibility = 'visible';
      this.status = 'single';
    }
  }
}