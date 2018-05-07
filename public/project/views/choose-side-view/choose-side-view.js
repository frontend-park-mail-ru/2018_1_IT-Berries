import View from '../view/view.js';
import chooseSideViewTemplate from './choose-side-view.tmpl.pug';
import UsersModel from "../../models/users-model";

export default class ChooseSideView extends View {

  constructor() {
    super(chooseSideViewTemplate);
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {};
    const returnedValue = super.render(attrs);
    this.el.getElementsByClassName('choose-side-view__human-side')[0].addEventListener('click', () => {
      UsersModel.getCurrentUser().side = 'humans';
    });
    this.el.getElementsByClassName('choose-side-view__ufo-side')[0].addEventListener('click', () => {
      UsersModel.getCurrentUser().side = 'ufo';
    });

    return returnedValue;
  }

}