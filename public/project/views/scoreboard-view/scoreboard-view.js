define('ScoreboardView', function (require) {
  const View = require('View');
  const bus = require('bus');
  const UsersModel = require('UsersModel');
  const ScoreboardTableBlock = require('ScoreboardTableBlock');
  const ScoreboardPaginatorBlock = require('ScoreboardPaginatorBlock');

  return class ScoreboardView extends View {
    constructor() {
      super('scoreboardViewTmplTemplate');
      this.listSize = 3;
      this.listNumber = 1;
    }

    async create(attrs, listSize = this.listSize, listNumber = this.listNumber) {
      console.log('scoreboard create', attrs);
      super.create(attrs);
      const scoreboardTableRoot = this.el.querySelector('.js-scoreboard-table');
      const scoreboardPaginationRoot = this.el.querySelector('.js-scoreboard-pagination');

      const response = await UsersModel.loadList(listSize, listNumber);
      if (response.ok) {
        this.scoreboardTable = new ScoreboardTableBlock({el: scoreboardTableRoot});
        this.scoreboardTable.data = response.data.scorelist;
        this.scoreboardTable.render();

        this.scoreboardPaginator = new ScoreboardPaginatorBlock({el: scoreboardPaginationRoot});
        this.scoreboardPaginator.data = response.data.scorelist;
        this.scoreboardPaginator.usersCount = response.data.length;
        this.scoreboardPaginator.render(listSize, listNumber, this.create.bind(this));
      } else {
        console.error('Scoreboard cannot be loaded.');
      }

      return this;
    }
  };
});
