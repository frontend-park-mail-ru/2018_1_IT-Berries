import View from '../view/view.js';
import chooseSideViewTemplate from './choose-side-view.tmpl.pug';
import UsersModel from '../../models/users-model';
import Router from '../../modules/router';

export default class ChooseSideView extends View {

  constructor() {
    super(chooseSideViewTemplate);
  }

  allowed() {
    return true;
  }

  render() {
    const profile = UsersModel.getCurrentUser();
    const attrs = {
      profile
    };
    const returnedValue = super.render(attrs);
    this.el.getElementsByClassName('choose-side-view__human-side')[0].addEventListener('click', async () => {
      UsersModel.getCurrentUser().side = 'humans';
      await new Router().open('/game');
    });
    this.el.getElementsByClassName('choose-side-view__ufo-side')[0].addEventListener('click', async () => {
      UsersModel.getCurrentUser().side = 'aliens';
      await new Router().open('/game');
    });

    return returnedValue;
  }

}