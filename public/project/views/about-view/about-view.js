import View from '../view/view.js';
import UsersModel from '../../models/users-model.js';

export default class AboutView extends View {

  constructor() {
    super('aboutViewTmplTemplate');
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