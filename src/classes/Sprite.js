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
    this.weaponList = params.weapons;
  }


  init(game, dungeonLvl) {
    const indexArr = [];
    this.monsterCoor = [];
    this.healthCoor = [];

    while (indexArr.length < 20) {
      const randNum = Math.floor(Math.random() * game.playArea.length);

      if (indexArr.indexOf(randNum) === -1) {
        indexArr.push(randNum);
      }
    }

    const spriteCoors = indexArr.map(index => game.playArea[index]);

    this.setMonsters(game, spriteCoors.slice(0, 10));
    this.setHealths(game, spriteCoors.slice(10, 17));
    this.setWeapon(game, spriteCoors[17]);
    this.setPlayer(game, spriteCoors[18]);

    if (dungeonLvl === params.maxLevel) {
      this.setBoss(game, spriteCoors[19]);
    } else {
      this.setExit(game, spriteCoors[19]);
    }
  }


  compileMonsterData(dungeonLvl) {
    return this.monsterCoor.map(coor => ({
      ...coor,
      hp: params.monsterBaseHP +
        (params.monsterHPMultiplier * dungeonLvl),
    }));
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

  setMonsters(game, coors) {
    coors.forEach((coor) => {
      const { row, col } = coor;

      game.setCell(row, col, cellType.monster);
      this.monsterCoor.push(coor);
    });
  }


  setHealths(game, coors) {
    coors.forEach((coor) => {
      const { row, col } = coor;

      game.setCell(row, col, cellType.monster);
      this.monsterCoor.push(coor);
      game.setCell(row, col, cellType.health);
      this.healthCoor.push(coor);
    });
  }


  setWeapon(game, coor) {
    const { row, col } = coor;

    game.setCell(row, col, cellType.weapon);
    this.weaponCoor = coor;
  }


  setPlayer(game, coor) {
    const { row, col } = coor;

    game.setCell(row, col, cellType.player);
    this.playerCoor = coor;
  }


  setExit(game, coor) {
    const { row, col } = coor;

    game.setCell(row, col, cellType.exit);
    this.exitCoor = coor;
  }


  setBoss(game, coor) {
    const { row, col } = coor;

    game.setCell(row, col, cellType.boss);
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
