import View from '../view/view.js';
import Game from '../../modules/game/game.js';
import GAME_MODES from '../../modules/game/modes.js';
import UsersModel from '../../models/users-model.js';

export default class GameView extends View {

  constructor() {
    super('gameViewTmplTemplate');
  }

  allowed() {
    return true;
  }

  async create(attrs) {
    const profile = UsersModel.getCurrentUser();
    attrs = {profile};
    super.create(attrs);
    this.doGame(attrs);
    
    return this;
  }

  doGame(attrs) {
    let mode = GAME_MODES;
    if (attrs.pathname === '/game/online-mode') {
      mode = GAME_MODES.ONLINE;
    } else {
      mode = GAME_MODES.OFFLINE;
    }
    this.game = new Game(mode, this.eventBus, attrs.profile);
    this.game.start();
  }

}