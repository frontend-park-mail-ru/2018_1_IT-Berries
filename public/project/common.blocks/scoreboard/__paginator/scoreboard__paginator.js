import scoreboardPaginatorTemplate from './scoreboard__paginator.tmpl.pug';

/** Class representing a scoreboard paginator block. */
export default class ScoreboardPaginatorBlock {

  /**
   * Create a scoreboard paginator block.
   */
  constructor({ el = null }) {
    this._el = el;
  }

  /**
   * Get the number of users in pagination list.
   * @return {Number} The usersCount value.
   */
  get usersCount() {
    return this._usersCount;
  }

  /**
   * Set the number of users in pagination list.
   * @param {Object} count - The number of users.
   */
  set usersCount(count = 0) {
    this._usersCount = count;
  }

  /**
   * Clear HTML component's body.
   */
  clear() {
    this._el.innerHTML = '';
  }

  /**
   * Render scoreboard paginator template in HTML component's body.
   * @param {Number} listSize - The number of rows on list.
   * @param {Number} listNumber - Current page.
   * @param {Function} callback - Callback function for paginator's links.
   */
  render(listSize = 5, listNumber = 1, callback) {
    let listCount = 0;
    if (!this._usersCount) {
      return;
    }
    if (this._usersCount <= listSize) {
      listCount = 0;
    } else {
      listCount = Math.ceil(this._usersCount / listSize);
    }
    const count = {listCount : listCount, listNumber : listNumber};
    const template = scoreboardPaginatorTemplate(count);
    this._el.innerHTML = template;
    const paginatorLinks = document.getElementsByClassName('scoreboard__paginator-link');
    Array.prototype.forEach.call(paginatorLinks, (paginatorLink) => {
      paginatorLink.addEventListener('click', (evt) => {
        evt.preventDefault();
        const target = evt.target;
        const value = Number(target.innerHTML);
        callback(undefined, listSize, value);
      });
    });
    const arrowLeft = document.getElementsByClassName('scoreboard__paginator-left');
    if (arrowLeft.length !== 0) {
      arrowLeft[0].addEventListener('click', (evt) => {
        evt.preventDefault();
        callback(undefined, listSize, listNumber - 1);
      });
    }
    const arrowRight = document.getElementsByClassName('scoreboard__paginator-right');
    if (arrowRight.length !== 0) {
      arrowRight[0].addEventListener('click', (evt) => {
        evt.preventDefault();
        callback(undefined, listSize, listNumber + 1);
      });
    }
  }

}