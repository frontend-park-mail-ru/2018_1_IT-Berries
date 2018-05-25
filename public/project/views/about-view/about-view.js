import View from '../view/view.js';
import UsersModel from '../../models/users-model.js';
import aboutViewTemplate from './about-view.tmpl.pug';

export default class AboutView extends View {

  constructor() {
    super(aboutViewTemplate);
  }

  allowed() {
    return true;
  }

  render() {
    const profile = UsersModel.getCurrentUser();
    const attrs = {
      profile
    };

    return super.render(attrs);
  }

}