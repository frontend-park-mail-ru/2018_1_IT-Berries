
export default class Cell {
  constructor(x, y, x_max) {
    this.ways = new Array(6);
    this.x = x;
    this.y = y;
    this.number = Math.ceil(this.y / 2) * x_max + Math.trunc(this.y / 2) * (x_max + 1) + this.x;
  }

  setCell0(cell0) {
    this.ways[0] = cell0;
  }

  setCell1(cell1) {
    this.ways[1] = cell1;
  }

  setCell2(cell2) {
    this.ways[2] = cell2;
  }

  setCell3(cell3) {
    this.ways[3] = cell3;
  }

  setCell4(cell4) {
    this.ways[4] = cell4;
  }

  setCell5(cell5) {
    this.ways[5] = cell5;
  }
}