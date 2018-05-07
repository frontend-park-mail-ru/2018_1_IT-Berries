import View from '../view/view.js';
import Game from '../../modules/game/game.js';
import GAME_MODES from '../../modules/game/modes.js';
import UsersModel from '../../models/users-model.js';
import gameViewTemplate from './game-view.tmpl.pug';

export default class GameView extends View {

  constructor() {
    super(gameViewTemplate);
  }

  allowed() {
    return true;
  }

  async create(attrs) {
    const profile = UsersModel.getCurrentUser();
    let side;
    try {
      side = UsersModel.getCurrentUser().side;
    } catch (e) {
      side = null;
    }
    attrs = {profile, side};
    super.create(attrs);
    this.doGame(attrs);
    
    return this;
  }

  doGame(attrs) {
    let mode = GAME_MODES;
    if (attrs.side === 'humans' || attrs.side === 'aliens') {
      mode = GAME_MODES.ONLINE;
    } else {
      mode = GAME_MODES.OFFLINE;
    }
    this.game = new Game(mode, this.eventBus, attrs.profile, attrs.side);
    this.game.start();
  }

}