import gameFieldBlock from '../../common.blocks/game-field/game-field.js';
import gameEvents from './engine/game-events.js';

export default class GameScene {
  constructor(x = 8, y = 7, eventBus) {
    this.eventsBus = eventBus;
    const gameFieldRoot = document.getElementsByClassName('game-view__game')[0];
    this.gameField = new gameFieldBlock(gameFieldRoot, x, y);
    this.gameField.render();
    this.x = x;
    this.y = y;
    this.cells = this.gameField._el.getElementsByClassName('cell');
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].addEventListener('click', this.playerTwoTurn.bind(this));
    }
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getUfoStartPosition() {
    return this.ufoStartPosition;
  }

  stepUfoTo(cell) {
    this.removeCallImgClass(this.ufoStartPosition.x, this.ufoStartPosition.y, 'ufo');
    this.addCallClassImgClass(this.ufoStartPosition.x, this.ufoStartPosition.y, 'empty_cell', 'empty-cell')
    this.removeCallClassImgClass(cell.x, cell.y, 'empty_cell', 'empty-cell');
    this.addCallImgClass(cell.x, cell.y, 'ufo');
    this.ufoStartPosition = {x: cell.x, y: cell.y}
  }

  reset() {
    this.setUfoPosition(Math.ceil(this.x / 2) - 1, Math.ceil(this.y / 2) - 1);
  }

  playerOneTurn() {
    this.player_turn = 1;
    this.gameField._el.classList.add('player_1_turn');
  }

  playerTwoTurn(event) {
    if (this.player_turn === 1 &&
      !event.target.classList.contains('ufo') &&
      !event.target.classList.contains('rocket')) {
      this.gameField._el.classList.remove('player_1_turn');
      this.setRocket(event.target);
      this.eventsBus.emit(gameEvents.PLAYER_2_TURN, event.target);
    }

  }

  setRocket(cell) {
    cell.classList.remove('empty-cell');
    cell.parentNode.classList.remove('empty_cell');
    cell.classList.add('rocket');
    this.player_turn = 2;
  }

  async setUfoPosition(x, y) {
    this.ufoStartPosition = {x: x, y: y}
    this.addCallImgClass(x, y, 'ufo');
    this.removeCallClassImgClass(x, y,'empty_cell', 'empty-cell');
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