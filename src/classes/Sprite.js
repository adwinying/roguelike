import { spriteConst as params } from '../constants';

const cellType = params.cell;

export default class Sprite {
  constructor() {
    this.exitCoor = {};
    this.playerCoor = {};
    this.weaponCoor = {};
    this.bossCoor = {};
    this.healthCoor = [];
    this.monsterCoor = [];
    this.monsters = [];
    this.weaponList = params.weapons;
  }


  init(board, dungeonLvl) {
    const indexArr = [];
    this.monsterCoor = [];
    this.healthCoor = [];

    while (indexArr.length < 20) {
      const randNum = Math.floor(Math.random() * board.playArea.length);

      if (indexArr.indexOf(randNum) === -1) {
        indexArr.push(randNum);
      }
    }

    const spriteCoors  = indexArr.map(index =>
      board.playArea[index]);
    const monsterCoors = spriteCoors.slice(0, 10);
    const healthCoors  = spriteCoors.slice(10, 17);
    const weaponCoor   = spriteCoors[17];
    const playerCoor   = spriteCoors[18];
    const endCoor      = spriteCoors[19];

    this.setMonsters(board, monsterCoors);
    this.setHealths(board, healthCoors);
    this.setWeapon(board, weaponCoor);
    this.setPlayer(board, playerCoor);

    if (dungeonLvl === params.maxLevel) {
      this.setBoss(board, endCoor);
    } else {
      this.setExit(board, endCoor);
    }
  }


  compileMonsterData(dungeonLvl) {
    this.monsters = this.monsterCoor.map(coor => ({
      ...coor,
      hp: params.monsterBaseHP +
        (params.monsterHPMultiplier * dungeonLvl),
    }));

    return this.monsters;
  }


  compileBossData() {
    return {
      ...this.bossCoor,
      hp: params.bossHP,
    };
  }


  getNextWeapon(dungeonLvl) {
    return this.weaponList[dungeonLvl];
  }


  /**
   * Private methods
   */

  setMonsters(board, coors) {
    coors.forEach((coor) => {
      const { row, col } = coor;

      board.setCell(row, col, cellType.monster);
      this.monsterCoor.push(coor);
    });
  }


  setHealths(board, coors) {
    coors.forEach((coor) => {
      const { row, col } = coor;

      board.setCell(row, col, cellType.monster);
      this.monsterCoor.push(coor);
      board.setCell(row, col, cellType.health);
      this.healthCoor.push(coor);
    });
  }


  setWeapon(board, coor) {
    const { row, col } = coor;

    board.setCell(row, col, cellType.weapon);
    this.weaponCoor = coor;
  }


  setPlayer(board, coor) {
    const { row, col } = coor;

    board.setCell(row, col, cellType.player);
    this.playerCoor = coor;
  }


  setExit(board, coor) {
    const { row, col } = coor;

    board.setCell(row, col, cellType.exit);
    this.exitCoor = coor;
  }


  setBoss(board, coor) {
    const { row, col } = coor;

    board.setCell(row, col, cellType.boss);
    this.bossCoor = coor;
  }


  /**
   * Static methods
   */

  static getMonsterDmg(dungeonLvl) {
    const { monsterBaseDmg, monsterDmgMultiplier } = params;
    const dmgRange = Math.floor(Math.random() * monsterDmgMultiplier);

    return (monsterBaseDmg * dungeonLvl) + dmgRange;
  }


  static getMonsterIndex(array, obj) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].row === obj.row && array[i].col === obj.col) {
        return i;
      }
    }

    return -1;
  }


  static getPlayerDmg(currWeapon, playerLvl) {
    return currWeapon.baseDmg + (playerLvl * params.playerDmgMultiplier);
  }
}
