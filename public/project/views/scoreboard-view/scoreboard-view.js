import View from '../view/view.js';
import ScoreboardTableBlock from '../../common.blocks/scoreboard/__table/scoreboard__table.js';
import ScoreboardPaginatorBlock from '../../common.blocks/scoreboard/__paginator/scoreboard__paginator.js';
import UsersModel from '../../models/users-model.js';

export default class ScoreboardView extends View {
  constructor() {
    super('scoreboardViewTmplTemplate');
    this.listSize = 3;
    this.listNumber = 1;
  }

  render() {
    const profile = UsersModel.getCurrentUser();
    const attrs = {
      profile
    };

    return super.render(attrs);
  }

  async create(attrs, listSize = this.listSize, listNumber = this.listNumber) {
    super.create(attrs);
    const scoreboardTableRoot = this.el.querySelector('.js-scoreboard-table');

    const response = await UsersModel.loadList(listSize, listNumber);
    if (response.ok) {
      this.scoreboardTable = new ScoreboardTableBlock({el: scoreboardTableRoot});
      this.scoreboardTable.data = response.data.scorelist;
      this.scoreboardTable.render();

      const scoreboardPaginationRoot = document.getElementsByClassName('js-scoreboard-pagination')[0];
      this.scoreboardPaginator = new ScoreboardPaginatorBlock({el: scoreboardPaginationRoot});
      this.scoreboardPaginator.data = response.data.scorelist;
      this.scoreboardPaginator.usersCount = response.data.length;
      this.scoreboardPaginator.render(listSize, listNumber, this.create.bind(this));
    } else {

      // console.error('Scoreboard cannot be loaded.');
    }

    return this;
  }
}