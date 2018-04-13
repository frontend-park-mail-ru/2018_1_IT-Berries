
export default class Bot {
  constructor(map, startPosition) {
    this.map = map;
    this.position = startPosition;
  }

  getPosition() {
    return this.position;
  }

  searchWay() {
    const startCell = this.map[this.position.y][this.position.x];
    const nodesCount = this.map[this.map.length - 1][this.map[0].length - 1].number;
    const q = new Array(0);
    q.push(startCell);
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map.length + i % 2; j++) {
        this.map[i][j].used = false;
      }
    }
    startCell.used = true;
    const d = new Array(nodesCount);
    const p = new Array(nodesCount);
    p[startCell.number] = -1;
    while(q.length !== 0) {
      let v = q.shift();
      for (let i = 0; i < v.ways.length; i++) {
        let to = v.ways[i];
        if (to !== null && to.used !== true && to.isRocket !== true) {
          to.used = true;
          q.push(to);
          d[to.number] = d[v.number] + 1;
          p[to.number] = v;
          if (to.x === 0 ||
            to.x === this.map[to.y].length - 1 ||
            to.y === 0 || to.y === this.map.length - 1) {
            const path = Array(0);
            for (let j = to; j !== startCell; j = p[j.number]) {
              path.push(j);
            }
            const newPos = path.pop();
            this.position = {x: newPos.x, y: newPos.y};
            return newPos;
          }
        }
      }
    }
    return 'No way!';
  }
}