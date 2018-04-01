define('ScoreboardView', function (require) {
  const View = require('View');
  const UsersModel = require('UsersModel');
  const ScoreboardTableBlock = require('ScoreboardTableBlock');
  const ScoreboardPaginatorBlock = require('ScoreboardPaginatorBlock');

  return class ScoreboardView extends View {
    constructor() {
      super('scoreboardViewTmplTemplate');
    }

    create(attrs) {
      super.create(attrs);
      const scoreboardRoot = this.el.querySelector('.js-scoreboard');
      UsersModel.loadList()
        .then(function (users) {
          this.scoreboardTable = new ScoreboardTableBlock({el: scoreboardRoot});
          this.scoreboardPaginator = new ScoreboardPaginatorBlock({el: scoreboardRoot});

          this.scoreboardTable.data = users;
          this.scoreboardPaginator.data = users;

          this.scoreboardTable.render();
          this.scoreboardPaginator.render();
        }.bind(this))
        .catch(console.error);

      return this;
    }
  };
});
