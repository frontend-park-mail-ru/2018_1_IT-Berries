import gameFieldBlock from '../../common.blocks/game-field/game-field.js';
import gameEvents from './engine/game-events.js';
import settings from '../../modules/settings';

export default class GameScene {
  constructor(x = 8, y = 7, eventBus, side, mode) {
    this.mode = mode;
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
    this.humansTimer =  document.getElementsByClassName('player-info__timer')[0];
    this.humansTimer.style.visibility = 'hidden';
    this.ufoTimer =  document.getElementsByClassName('player-info__timer')[1];
    this.ufoTimer.style.visibility = 'hidden';
    this.gameTime = document.getElementsByClassName('game-time')[0];
    this.moves = [0, 0];
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

  stepUfoTo(cell) {
    this.removeCallImgClass(this.ufoPosition.x, this.ufoPosition.y, 'ufo');
    this.removeCallImgClass(this.ufoPosition.x, this.ufoPosition.y, 'ufo_theme-' + settings.getCurrentThemeOrVpn());
    this.addCallClassImgClass(this.ufoPosition.x, this.ufoPosition.y, 'empty_cell', 'empty-cell');
    this.addCallClassImgClass(this.ufoPosition.x, this.ufoPosition.y, 'empty_cell', 'empty-cell_theme-' + settings.getCurrentThemeOrVpn());
    this.removeCallClassImgClass(cell.x, cell.y, 'empty_cell', 'empty-cell');
    this.removeCallClassImgClass(cell.x, cell.y, 'empty_cell', 'empty-cell_theme-' + settings.getCurrentThemeOrVpn());
    this.addCallImgClass(cell.x, cell.y, 'ufo');
    this.addCallImgClass(cell.x, cell.y, 'ufo_theme-' + settings.getCurrentThemeOrVpn());
    this.ufoPosition = {x: cell.x, y: cell.y};
    this.player_turn = 1;
  }

  reset() {
    if (this.gameTimeId !== undefined && this.gameTimeId !== null) {
      clearInterval(this.gameTimeId);
    }
    if (this.gameTime.style.visibility === 'hidden') {
      this.gameTime.style.visibility = 'visible';
    }
    this.setUfoPosition(Math.ceil(this.x / 2) - 1, Math.ceil(this.y / 2) - 1);
    this.gameTime.innerHTML = '0:00';
    this.gameTimeValue = 0;
    this.gameTimeId = setInterval(function() {
      this.gameTimeValue++;
      this.gameTime.innerHTML = (Math.floor(this.gameTimeValue / 60)).toString() + ':';
      if (this.gameTimeValue % 60 < 10) {
        this.gameTime.innerHTML += '0';
      }
      this.gameTime.innerHTML += (this.gameTimeValue % 60).toString();
    }.bind(this), 1000);
  }

  playerHumanTurn() {
    this.player_turn = 1;
    this.gameField._el.classList.add('player_human_turn');
  }

  restartTimer(turn) {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
    this.timerValue = 30;
    if (turn === 'humans') {
      this.humansTimer.innerHTML = '0:30';
      this.humansTimer.style.color = 'azure';
      this.humansTimer.style.visibility = 'visible';
      this.ufoTimer.style.visibility = 'hidden';
      this.timer = setInterval(function() {
        this.timerTick(this.humansTimer);
      }.bind(this), 1000);
    } else {
      this.ufoTimer.innerHTML = '0:30';
      this.ufoTimer.style.color = 'azure';
      this.ufoTimer.style.visibility = 'visible';
      this.humansTimer.style.visibility = 'hidden';
      this.timer = setInterval(function() {
        this.timerTick(this.ufoTimer);
      }.bind(this), 1000);
    }
  }

  timerTick(timer) {
    this.timerValue--;
    timer.innerHTML = '0:';
    if (this.timerValue < 10) {
      timer.innerHTML += '0';
    }
    timer.innerHTML += this.timerValue.toString();
    if (this.timerValue <= 10) {
      timer.style.color = 'red';
    }
    if (this.timerValue === 0) {
      clearInterval(this.timer);
      if (this.mode === 'offline') {
        this.changeTurn();
      }
    }
  }

  changeTurn() {
    if (this.player_turn === 1) {
      if (this.side === 'humans') {
        this.opponentUfoTurn('Time over!');
      } else {
        this.playerUfoTurn();
      }
      this.player_turn = 2;
    } else {
      if (this.side === 'aliens') {
        this.opponentHumanTurn('Time over!');
      } else {
        this.playerHumanTurn();
      }
      this.player_turn = 1;

    }
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
        this.cellChangeImgClass(cell, 'empty-cell_theme-' + settings.getCurrentThemeOrVpn(),
          'ufo-hidden_theme-' + settings.getCurrentThemeOrVpn());
        cell.addEventListener('click', this.opponentHumanTurn.bind(this));
        this.ufoPosibleTurns.push(cell);
      }
    }
  }

  stopAllTimers() {
    if (this.timer !== undefined && this.timer !== null) {
      clearInterval(this.timer);
    }
    if (this.gameTimeId !== undefined && this.gameTimeId !== null) {
      clearInterval(this.gameTimeId);
    }
  }

  increaseTheNumberOfSteps(index) {
    this.moves[index]++;
    document.getElementsByClassName('player-moves')[index].innerHTML = this.moves[index].toString();
  }

  opponentUfoTurn(event) {
    if (event === 'Time over!' || (this.player_turn === 1 &&
      !event.target.classList.contains('ufo') &&
      !event.target.classList.contains('rocket')) || (event.payload !== undefined)) {
      this.gameField._el.classList.remove('player_human_turn');
      if (event !== 'Time over!' && event.payload === undefined) {
        this.setRocket(event.target);
        if (this.mode === 'online') {
          this.increaseTheNumberOfSteps(0);
        }
      }
      if (event.payload === undefined) {
        this.eventsBus.emit(gameEvents.UFO_TURN, event);
      }
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
    if (event === 'Time over!' || (this.player_turn === 2 &&
      !event.target.classList.contains('ufo') &&
      !event.target.classList.contains('rocket')) || (event.payload !== undefined)) {
      this.gameField._el.classList.remove('player_ufo_turn');
      if (this.ufoPosibleTurns !== undefined) {
        for (let i = 0; i < this.ufoPosibleTurns.length; i++) {
          const cell = this.ufoPosibleTurns[i];
          cell.removeEventListener('click', this.opponentHumanTurn.bind(this));
          this.cellChangeClass(cell, 'ufo_hidden', 'empty_cell');
          this.cellChangeImgClass(cell, 'ufo-hidden', 'empty-cell');
          this.cellChangeImgClass(cell, 'ufo-hidden_theme-' + settings.getCurrentThemeOrVpn(),
            'empty-cell_theme-' + settings.getCurrentThemeOrVpn());
        }
        delete this.ufoPosibleTurns;
      }
      if (event !== 'Time over!' && event.payload === undefined) {
        const ufoColumn = event.target.parentNode.className.match(/\d+/g)[0];
        const ufoRow = event.target.parentNode.parentNode.parentNode.parentNode.classList[0].match(/\d+/g)[0];
        const cell = {x: ufoColumn, y: ufoRow};
        this.stepUfoTo(cell);
        if (this.mode === 'online') {
          this.increaseTheNumberOfSteps(1);
        }
      }
      if (event.payload === undefined) {
        this.eventsBus.emit(gameEvents.HUMANS_TURN, event);
      }
    }
  }

  setRocket(cell) {
    cell.classList.remove('empty-cell');
    cell.classList.remove('empty-cell_theme-' + settings.getCurrentThemeOrVpn());
    cell.parentNode.classList.remove('empty_cell');
    cell.classList.add('rocket');
    cell.classList.add('rocket_theme-' + settings.getCurrentThemeOrVpn());
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
    this.addCallImgClass(x, y, 'ufo_theme-' + settings.getCurrentThemeOrVpn());
    this.removeCallClassImgClass(x, y, 'empty_cell', 'empty-cell');
    this.removeCallClassImgClass(x, y, 'empty_cell', 'empty-cell_theme-' + settings.getCurrentThemeOrVpn());
  }

  turnOnCellIlluminationOnHover(x, y) {
    this.addCallClass(x, y, 'IlluminationHoverOn');
  }

  turnOffCellIlluminationOnHover(x, y) {
    this.removeCallClass(x, y, 'IlluminationHoverOn');
  }

  turnOnCellUfoOnHover(x, y) {
    this.addCallClassImgClass(x, y, 'ufoHoverOn', 'ufo');
    this.addCallClassImgClass(x, y, 'ufoHoverOn', 'ufo_theme-' + settings.getCurrentThemeOrVpn());
  }

  turnOffCellUfoOnHover(x, y) {
    this.removeCallClassImgClass(x, y, 'ufoHoverOn', 'ufo');
    this.removeCallClassImgClass(x, y, 'ufoHoverOn', 'ufo_theme-' + settings.getCurrentThemeOrVpn());
  }

  turnOnCellRocketOnHover(x, y) {
    this.addCallClassImgClass(x, y, 'rocketHoverOn', 'rocket');
    this.addCallClassImgClass(x, y, 'rocketHoverOn', 'rocket_theme-' + settings.getCurrentThemeOrVpn());
  }

  turnOffCellRocketOnHover(x, y) {
    this.removeCallClassImgClass(x, y, 'rocketHoverOn', 'rocket');
    this.removeCallClassImgClass(x, y, 'rocketHoverOn', 'rocket_theme-' + settings.getCurrentThemeOrVpn());
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