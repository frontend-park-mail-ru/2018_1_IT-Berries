define('ScoreboardView', function (require) {
  const View = require('View');
  const UsersModel = require('UsersModel');
  const ScoreboardTableBlock = require('ScoreboardTableBlock');
  const ScoreboardPaginatorBlock = require('ScoreboardPaginatorBlock');

  return class ScoreboardView extends View {
    constructor() {
      super('scoreboardViewTmplTemplate');
      this.listSize = 3;
      this.listNumber = 1;
    }

    create(attrs) {
      console.log('scoreboard create', attrs);
      super.create(attrs);
      const scoreboardTableRoot = this.el.querySelector('.js-scoreboard-table');
      const scoreboardPaginationRoot = this.el.querySelector('.js-scoreboard-pagination');
      UsersModel.loadList(this.listSize, this.listNumber)
        .then(function (users) {
          this.scoreboardTable = new ScoreboardTableBlock({el: scoreboardTableRoot});
          this.scoreboardTable.data = users;
          this.scoreboardTable.render();

          this.scoreboardPaginator = new ScoreboardPaginatorBlock({el: scoreboardPaginationRoot});
          this.scoreboardPaginator.data = users;
          this.scoreboardPaginator.usersCount = users.length;
          this.scoreboardPaginator.render(this.listSize, this.listNumber, this.create.bind(this));

        }.bind(this))
        .catch(console.error);

      return this;
    }
  };
});
