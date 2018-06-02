import View from '../view/view.js';
import Game from '../../modules/game/game.js';
import GAME_MODES from '../../modules/game/modes.js';
import UsersModel from '../../models/users-model.js';
import gameViewTemplate from './game-view.tmpl.pug';
import settings from '../../modules/settings';

export default class GameView extends View {

  constructor() {
    super(gameViewTemplate);
  }

  allowed() {
    return true;
  }

  async create(path) {

    const profile = UsersModel.getCurrentUser();
    let side;
    try {
      side = UsersModel.getCurrentUser().side;
    } catch (e) {
      side = 'humans';
    }
    let attrs = {
      profile,
      side,
      path,
      theme: settings.getCurrentThemeOrVpn(),
      header: settings.getHeader()
    };
    super.create(attrs);
    this.doGame(attrs);
    
    return this;
  }

  doGame(attrs) {
    let mode = GAME_MODES;
    if (attrs.path === '/game/online-mode') {
      mode = GAME_MODES.ONLINE;
    } else {
      mode = GAME_MODES.OFFLINE;
    }
    this.game = new Game(mode, this.eventBus, attrs.profile, attrs.side);
    this.game.start();
  }

}