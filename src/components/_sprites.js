export default class Sprites {
  constructor() {
    this.exitCoor = {};
    this.playerCoor = {};
    this.weaponCoor = {};
    this.bossCoor = {};
    this.healthCoor = [];
    this.monsterCoor = [];
    this.weaponList = [
      {
        name   : 'Stick',
        baseDmg: 2,
      },
      {
        name   : 'Dagger',
        baseDmg: 5,
      },
      {
        name   : 'Spear',
        baseDmg: 11,
      },
      {
        name   : 'Crossbow',
        baseDmg: 16,
      },
      {
        name   : 'Katana',
        baseDmg: 22,
      },
      {
        name   : 'Scythe',
        baseDmg: 28,
      },
    ];
  }

  init(game, dungeonLvl) {
    const spriteCoor = [];
    const indexArr = [];
    this.monsterCoor = [];
    this.healthCoor = [];

    while (indexArr.length < 20) {
      const randNum = Math.floor(Math.random() * game.playArea.length);

      if (indexArr.indexOf(randNum) === -1) {
        indexArr.push(randNum);
      }
    }

    indexArr.forEach((index) => {
      spriteCoor.push(game.playArea[index]);
    });

    for (let i = 0; i < spriteCoor.length; i += 1) {
      const row = spriteCoor[i].r;
      const col = spriteCoor[i].c;
      if (i < 10) {
        // Set monsters
        game.setCell(row, col, 2);
        this.monsterCoor.push(spriteCoor[i]);
      } else if (i >= 10 && i < 17) {
        // Set health boosters
        game.setCell(row, col, 6);
        this.healthCoor.push(spriteCoor[i]);
      } else if (i === 17) {
        // Set weapon
        game.setCell(row, col, 3);
        this.weaponCoor = spriteCoor[i];
      } else if (i === 18) {
        // Set boss at final dungeon lvl; else set exit
        if (dungeonLvl === 5) {
          game.setCell(row, col, 7);
          this.bossCoor = spriteCoor[i];
        } else {
          game.setCell(row, col, 4);
          this.exitCoor = spriteCoor[i];
        }
      } else if (i === 19) {
        // Set player spawn location
        game.setCell(row, col, 5);
        this.playerCoor = spriteCoor[i];
      }
    }
  }

  compileMonsterData(dungeonLvl) {
    const monsterData = this.monsterCoor.map(coor => ({
      ...coor,
      hp: 5 + (20 * dungeonLvl),
    }));

    return monsterData;
  }

  compileBossData() {
    return {
      ...this.bossCoor,
      hp: 500,
    };
  }

  getNextWeapon(dungeonLvl) {
    return this.weaponList[dungeonLvl];
  }

  static getMonsterDmg(dungeonLvl) {
    const monsterBaseDmg = 3;
    const randNum = Math.floor(Math.random() * 4);

    return (monsterBaseDmg * dungeonLvl) + randNum;
  }

  static getMonsterIndex(array, obj) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].r === obj.r && array[i].c === obj.c) {
        return i;
      }
    }

    return -1;
  }

  static getCurrDmg(currWeapon, playerLvl) {
    return currWeapon.baseDmg + (playerLvl * 6);
  }
}
