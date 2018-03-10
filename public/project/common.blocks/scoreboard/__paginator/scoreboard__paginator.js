;
export default class ScoreboardPaginator {
  constructor() {
    this._el = document.querySelector('.scoreboard__paginator');
  }

  get usersCount() {
    return this._usersCount;
  }

  set usersCount(count = []) {
    this._usersCount = count;
  }

  clear() {
    this._el.innerHTML = '';
  }

  renderTmpl(listSize = 5, listNumber = 1, callback) {
    let listCount = 0;
    if (!this._usersCount) {
      return;
    }
    if (this._usersCount <= listSize) {
      listCount = 0;
    }
    else {
      listCount = Math.ceil(this._usersCount / listSize);
    }
    const count = {listCount : listCount, listNumber : listNumber};
    const template = window.scoreboardPaginatorTmplTemplate(count);
    this._el.innerHTML = template;
    const paginatorLinks = document.getElementsByClassName('scoreboard__paginator-link');
    Array.prototype.forEach.call(paginatorLinks, (paginatorLink) => {
      paginatorLink.addEventListener('click', (evt) => {
        evt.preventDefault();
        const target = evt.target;
        const value = Number(target.innerHTML);
        callback(listSize, value);
      });
    });
    const arrowLeft = document.getElementsByClassName('scoreboard__paginator-left');
    if (arrowLeft.length != 0) {
      arrowLeft[0].addEventListener('click', (evt) => {
        evt.preventDefault();
        callback(listSize, listNumber - 1);
      });
    }
    const arrowRight = document.getElementsByClassName('scoreboard__paginator-right');
    if (arrowRight.length != 0) {
      arrowRight[0].addEventListener('click', (evt) => {
        evt.preventDefault();
        callback(listSize, listNumber + 1);
      });
    }
  }

};