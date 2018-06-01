import View from '../view/view.js';
import notFoundViewTemplate from './not-found-view.tmpl.pug';

export default class NotFoundView extends View {

  constructor() {
    super(notFoundViewTemplate);
  }

}