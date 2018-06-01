import View from '../view/view.js';
import chooseSideViewTemplate from './choose-side-view.tmpl.pug';
import UsersModel from '../../models/users-model';
import Router from '../../modules/router';
import Game from '../../modules/game/game';
import settings from '../../modules/settings';

export default class ChooseSideView extends View {

  constructor() {
    super(chooseSideViewTemplate);
  }

  allowed() {
    return true;
  }

  async create(path) {
    if(path === '/side/online-mode') {
      this.game = '/game/online-mode';
    } else {
      this.game = '/game/offline-mode';
    }
    return super.create(path);
  }

  render() {
    const profile = UsersModel.getCurrentUser();
    const attrs = {
      profile,
      theme: settings.getCurrentThemeOrVpn()
    };
    const returnedValue = super.render(attrs);
    this.el.getElementsByClassName('choose-side-view__human-side')[0].addEventListener('click', async () => {
      Game.setSide('humans');
      await new Router().open(this.game);
    });
    this.el.getElementsByClassName('choose-side-view__ufo-side')[0].addEventListener('click', async () => {
      Game.setSide('aliens');
      await new Router().open(this.game);
    });

    return returnedValue;
  }

}