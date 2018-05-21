import gameFieldBlock from '../../common.blocks/game-field/game-field.js';
import gameEvents from './engine/game-events.js';

export default class GameScene {
  constructor(x = 8, y = 7, eventBus, side) {
    this.eventsBus = eventBus;
    const gameFieldRoot = document.getElementsByClassName('game-view__game')[0];
    this.panels = document.getElementsByClassName('player-panel');
    this.gameField = new gameFieldBlock(gameFieldRoot, x, y);
    this.gameField.render();
    this.x = x;
    this.y = y;
    this.cells = this.gameField._el.getElementsByClassName('cell');
    this.side = side;
    if (this.side !== 'aliens') {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].addEventListener('click', this.opponentUfoTurn.bind(this));
      }
    }
    this.onScoreChange = this.onScoreChange.bind(this);
    this.eventsBus.on(gameEvents.SCORE_CHANGE, this.onScoreChange);
  }

  onScoreChange(evt) {
    for (let i = 0; i < this.panels.length; i++) {
      if (this.getPanelName(i) === evt.name) {
        this.panels[i].getElementsByClassName('player-score')[0].innerHTML = evt.score;
      }
    }
  }

  setPanelScore(index, score) {
    this.panels[index].getElementsByClassName('player-score')[0].innerHTML = score;
  }

  setPanelName(index, name) {
    this.panels[index].getElementsByClassName('player-nickname')[0].innerHTML = name;
  }

  getPanelName(index) {
    return this.panels[index].getElementsByClassName('player-nickname')[0].innerHTML;
  }

  addmove(index) {
    let moves = this.panels[index].getElementsByClassName('player-moves')[0];
    moves.innerHTML = Number(moves.innerHTML) + 1;
    let score = this.panels[index].getElementsByClassName('player-score')[0];
    score.innerHTML = Number(score.innerHTML) + 10;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getUfoPosition() {
    return this.ufoPosition;
  }

  showConnectMessage(message) {
    const body = document.getElementsByClassName('game-view__game')[0];
    body.innerHTML = 'Waiting fo another player';
  }

  stepUfoTo(cell) {
    this.removeCallImgClass(this.ufoPosition.x, this.ufoPosition.y, 'ufo');
    this.addCallClassImgClass(this.ufoPosition.x, this.ufoPosition.y, 'empty_cell', 'empty-cell');
    this.removeCallClassImgClass(cell.x, cell.y, 'empty_cell', 'empty-cell');
    this.addCallImgClass(cell.x, cell.y, 'ufo');
    this.ufoPosition = {x: cell.x, y: cell.y};
    this.player_turn = 1;
  }

  reset() {
    this.setUfoPosition(Math.ceil(this.x / 2) - 1, Math.ceil(this.y / 2) - 1);
  }

  playerHumanTurn() {
    this.player_turn = 1;
    this.gameField._el.classList.add('player_human_turn');
  }

  playerUfoTurn() {
    const ufo = this.getUfoPosition();
    ufo.x = Number(ufo.x);
    ufo.y = Number(ufo.y);
    let ufoCells = new Array(0);
    ufoCells.push({y: ufo.y, x: ufo.x + 1});
    ufoCells.push({y: ufo.y, x: ufo.x - 1});
    if (ufo.y % 2 === 1) {
      ufoCells.push({y: ufo.y + 1, x: ufo.x});
      ufoCells.push({y: ufo.y + 1, x: ufo.x - 1});
      ufoCells.push({y: ufo.y - 1, x: ufo.x - 1});
      ufoCells.push({y: ufo.y - 1, x: ufo.x});
    } else {
      ufoCells.push({y: ufo.y + 1, x: ufo.x + 1});
      ufoCells.push({y: ufo.y + 1, x: ufo.x});
      ufoCells.push({y: ufo.y - 1, x: ufo.x});
      ufoCells.push({y: ufo.y - 1, x: ufo.x + 1});
    }
    this.gameField._el.classList.add('player_ufo_turn'); //ufo-hidden
    this.ufoPosibleTurns = new Array(0);
    for (let i = 0; i < ufoCells.length; i++) {
      const cell = this.getCell(ufoCells[i].x, ufoCells[i].y);
      const img = cell.getElementsByClassName('cell')[0];
      if (!img.classList.contains('rocket')) {
        this.cellChangeClass(cell, 'empty_cell', 'ufo_hidden');
        this.cellChangeImgClass(cell, 'empty-cell', 'ufo-hidden');
        cell.addEventListener('click', this.opponentHumanTurn.bind(this));
        this.ufoPosibleTurns.push(cell);
      }
    }
  }

  opponentUfoTurn(event) {
    if (this.player_turn === 1 &&
      !event.target.classList.contains('ufo') &&
      !event.target.classList.contains('rocket')) {
      this.gameField._el.classList.remove('player_human_turn');
      this.setRocket(event.target);
      this.eventsBus.emit(gameEvents.UFO_TURN, event.target);
    }
  }

  cellChangeClass(cell, oldClass, newClass) {
    cell.classList.remove(oldClass);
    cell.classList.add(newClass);
  }

  cellChangeImgClass(cell, oldClass, newClass) {
    const img = cell.getElementsByClassName('cell')[0];
    img.classList.remove(oldClass);
    img.classList.add(newClass);
  }

  opponentHumanTurn(event) {
    if (this.player_turn === 2 &&
      !event.target.classList.contains('ufo') &&
      !event.target.classList.contains('rocket')) {
      this.gameField._el.classList.remove('player_ufo_turn');
      if (this.ufoPosibleTurns !== undefined) {
        for (let i = 0; i < this.ufoPosibleTurns.length; i++) {
          const cell = this.ufoPosibleTurns[i];
          cell.removeEventListener('click', this.opponentHumanTurn.bind(this));
          this.cellChangeClass(cell, 'ufo_hidden', 'empty_cell');
          this.cellChangeImgClass(cell, 'ufo-hidden', 'empty-cell');
        }
        delete this.ufoPosibleTurns;
      }
      const ufoColumn = event.target.parentNode.className.match(/\d+/g)[0];
      const ufoRow = event.target.parentNode.parentNode.parentNode.parentNode.classList[0].match(/\d+/g)[0];
      const cell = {x: ufoColumn, y: ufoRow};
      this.stepUfoTo(cell);
      this.eventsBus.emit(gameEvents.HUMANS_TURN, event.target);
    }
  }

  setRocket(cell) {
    cell.classList.remove('empty-cell');
    cell.parentNode.classList.remove('empty_cell');
    cell.classList.add('rocket');
    this.player_turn = 2;
  }

  setRocketByCoordinates(x, y) {
    const row = this.gameField._el.getElementsByClassName('playing-field-row-' + y)[0];
    const cell = row.getElementsByClassName('playing-field-column-' + x)[0];
    this.setRocket(cell.firstElementChild);
  }

  async setUfoPosition(x, y) {
    this.ufoPosition = {x: x, y: y};
    this.addCallImgClass(x, y, 'ufo');
    this.removeCallClassImgClass(x, y, 'empty_cell', 'empty-cell');
  }

  turnOnCellIlluminationOnHover(x, y) {
    this.addCallClass(x, y, 'IlluminationHoverOn');
  }

  turnOffCellIlluminationOnHover(x, y) {
    this.removeCallClass(x, y, 'IlluminationHoverOn');
  }

  turnOnCellUfoOnHover(x, y) {
    this.addCallClassImgClass(x, y, 'ufoHoverOn', 'ufo');
  }

  turnOffCellUfoOnHover(x, y) {
    this.removeCallClassImgClass(x, y, 'ufoHoverOn', 'ufo');
  }

  turnOnCellRocketOnHover(x, y) {
    this.addCallClassImgClass(x, y, 'rocketHoverOn', 'rocket');
  }

  turnOffCellRocketOnHover(x, y) {
    this.removeCallClassImgClass(x, y, 'rocketHoverOn', 'rocket');
  }

  getCell(x, y) {
    const row = this.gameField._el.getElementsByClassName('playing-field-row-' + y)[0];
    return row.getElementsByClassName('playing-field-column-' + x)[0];
  }

  addCallClass(x, y, callClass) {
    let cell = this.getCell(x, y);
    cell.classList.add(callClass);
    return cell;
  }

  addCallImgClass(x, y, imgClass) {
    const cell = this.getCell(x, y);
    let img = cell.getElementsByClassName('cell')[0];
    img.classList.add(imgClass);
  }

  removeCallImgClass(x, y, imgClass) {
    const cell = this.getCell(x, y);
    let img = cell.getElementsByClassName('cell')[0];
    img.classList.remove(imgClass);
  }

  removeCallClass(x, y, callClass) {
    let cell = this.getCell(x, y);
    cell.classList.remove(callClass);
    return cell;
  }

  addCallClassImgClass(x, y, callClass, imgClass) {
    let cell = this.addCallClass(x, y, callClass);
    let img = cell.getElementsByClassName('cell')[0];
    img.classList.add(imgClass);
  }

  removeCallClassImgClass(x, y, callClass, imgClass) {
    let cell = this.removeCallClass(x, y, callClass);
    let img = cell.getElementsByClassName('cell')[0];
    img.classList.remove(imgClass);
  }


}