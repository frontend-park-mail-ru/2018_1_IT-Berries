import Cell from './cell.js';

export default class Map {
  constructor(gameScene) {
    let x = gameScene.getX();
    let y = gameScene.getY();
    this.map = new Array(y);
    for (let i = 0; i < y; i++) {
      this.map[i] = new Array(x + i % 2);
      for (let j = 0; j < x + i % 2; j++) {
        this.map[i][j] = new Cell(j, i, x);
        if (j === gameScene.getUfoPosition().x && i === gameScene.getUfoPosition().y) {
          this.map[i][j].isAlian = true;
        }
      }
    }

    for (let i = 0; i < y; i++) {
      for (let j = 0; j < x + i % 2; j++) {
        if (j + 1 < x + i % 2) {
          this.map[i][j].setCell0( this.map[i][j + 1]);
        }
        if (j - 1 >= 0) {
          this.map[i][j].setCell3( this.map[i][j - 1]);
        }
        if (i % 2 === 0) {
          if ((i + 1 < y)) {
            this.map[i][j].setCell1( this.map[i + 1][j + 1]);
            this.map[i][j].setCell2( this.map[i + 1][j]);
          }
          if ((i - 1 >= 0)) {
            this.map[i][j].setCell4( this.map[i - 1][j]);
            this.map[i][j].setCell5( this.map[i - 1][j + 1]);
          }
        } else {
          if ((i + 1 < y)) {
            if (j + 1 < x + 1) {
              this.map[i][j].setCell1( this.map[i + 1][j]);
            }
            if (j - 1 >= 0) {
              this.map[i][j].setCell2( this.map[i + 1][j - 1]);
            }
          }
          if ((i - 1 >= 0)) {
            if (j - 1 >= 0) {
              this.map[i][j].setCell4( this.map[i - 1][j - 1]);
            }
            if (j + 1 < x + 1) {
              this.map[i][j].setCell5( this.map[i - 1][j]);
            }
          }
        }
      }
    }
    for (let i = 0; i < 20; i++) {
      let rocketY = Math.trunc(Math.random() * this.map.length);
      let rocketX = Math.trunc(Math.random() * this.map[rocketY].length);
      if (this.map[rocketY][rocketX].isAlian === true) {
        i--;
      } else {
        this.map[rocketY][rocketX].isRocket = true;
        gameScene.setRocketByCoordinates(rocketX, rocketY);
      }
    }
  }
}