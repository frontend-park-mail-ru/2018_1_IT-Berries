import View from '../view/view.js';

export default class AboutView extends View {

  constructor() {
    super('aboutViewTmplTemplate');
  }

  allowed() {
    return true;
  }

  render() {
    const attrs = {};

    return super.render(attrs);
  }

}