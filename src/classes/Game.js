import Board from './Board';
import Sprite from './Sprite';

import {
  gameConst as params,
  spriteConst as sprites,
} from '../constants';

const cellType = sprites.cell;

class Game {
  constructor() {
    this.board = new Board();
    this.sprites = new Sprite();

    this.board.initBoard();
    this.sprites.init(this.board, 1);
  }


  movePlayer(
    currCoor,
    targetCoor,
    player,
    monsters,
    boss,
    dungeonLvl,
  ) {
    const targetCellState = this.board.getCell(
      targetCoor.row,
      targetCoor.col,
    );

    switch (targetCellState) {
      case cellType.empty:
        return this.movePlayerToEmptyCell(
          currCoor,
          targetCoor,
        );

      case cellType.wall:
        return {
          player: {
            coor: currCoor,
          },
        };

      case cellType.monster:
        return this.movePlayerToMonsterCell(
          currCoor,
          targetCoor,
          player,
          monsters,
          dungeonLvl,
        );

      case cellType.weapon:
        return this.movePlayerToWeaponCell(
          currCoor,
          targetCoor,
          player,
          dungeonLvl,
        );

      case cellType.exit:
        return this.movePlayerToExitCell(
          player,
          dungeonLvl,
        );

      case cellType.health:
        return this.movePlayerToHealthCell(
          currCoor,
          targetCoor,
          player,
        );

      case cellType.boss:
        return this.movePlayerToBossCell(
          currCoor,
          targetCoor,
          player,
          boss,
        );

      default:
        throw new Error('Invalid cell type!');
    }
  }


  /**
   * Private methods
   */


  movePlayerToEmptyCell(currCoor, targetCoor) {
    this.board.movePlayer(currCoor, targetCoor);

    return {
      player: {
        coor: targetCoor,
      },
    };
  }


  movePlayerToMonsterCell(
    currCoor,
    targetCoor,
    player,
    monsters,
    dungeonLvl,
  ) {
    const { monsterBaseXP, playerBaseXP } = params;
    const monsterIndex = Sprite.getMonsterIndex(monsters, targetCoor);
    const monsterHP    = monsters[monsterIndex].hp - player.dmg;
    const newMonsters  = monsters.filter((monster, index) =>
      index !== monsterIndex);

    // console.log(monsterIndex, monsterHP, newMonsters);

    if (monsterIndex === -1) {
      throw new Error('monsterIndex not found!');
    }


    // If monster ded
    if (monsterHP <= 0) {
      let newXP  = player.xpToNxtLvl - (monsterBaseXP * dungeonLvl);
      this.board.setCell(targetCoor.row, targetCoor.col, cellType.empty);

      // If level up
      if (newXP <= 0) {
        const newLvl = player.lvl + 1;
        const newHP  = player.hp + (params.healthCellHP * newLvl);
        newXP = newXP + playerBaseXP + (params.healthCellHP * newLvl);

        return {
          monsters: newMonsters,
          player  : {
            ...player,
            hp        : newHP,
            xpToNxtLvl: newXP,
            lvl       : newLvl,
            dmg       : Sprite.getPlayerDmg(player.weapon, newLvl),
          },
        };
      }

      return {
        monsters: newMonsters,
        player  : {
          coor      : currCoor,
          xpToNxtLvl: newXP,
        },
      };
    }


    // If monster not ded
    const newHP = player.hp - Sprite.getMonsterDmg(dungeonLvl);


    // If player ded
    if (newHP <= 0) {
      this.resetGame();

      return {
        player: {
          coor: this.sprites.playerCoor,
        },
        monsters   : this.sprites.compileMonsterData(1),
        showAlert  : true,
        isPlayerDed: true,
      };
    }


    // If not, update monster data's HP and return
    newMonsters.push({
      ...targetCoor,
      hp: monsterHP,
    });

    return {
      monsters: newMonsters,
      player  : {
        coor: currCoor,
        hp  : newHP,
      },
    };
  }


  movePlayerToWeaponCell(currCoor, targetCoor, player, dungeonLvl) {
    const newWeapon = this.sprites.getNextWeapon(dungeonLvl);

    this.board.movePlayer(currCoor, targetCoor);

    return {
      player: {
        coor  : targetCoor,
        weapon: newWeapon,
        dmg   : Sprite.getPlayerDmg(newWeapon, player.lvl),
      },
    };
  }


  movePlayerToExitCell(player, dungeonLvl) {
    const newDungeonLvl = dungeonLvl + 1;
    this.resetGame(newDungeonLvl);

    return {
      player: {
        coor: this.sprites.playerCoor,
      },
      dungeonLvl: newDungeonLvl,
      boss      : this.sprites.compileBossData(),
      monsters  : this.sprites.compileMonsterData(newDungeonLvl),
    };
  }


  movePlayerToHealthCell(currCoor, targetCoor, player) {
    this.board.movePlayer(currCoor, targetCoor);

    return {
      player: {
        coor: targetCoor,
        hp  : player.hp + params.healthCellHP,
      },
    };
  }


  movePlayerToBossCell(currCoor, targetCoor, player, boss) {
    const bossHP = boss.hp - player.dmg;

    // If boss ded
    if (bossHP <= 0) {
      this.resetGame();

      return {
        player: {
          coor: this.sprites.playerCoor,
        },
        monsters   : this.sprites.compileMonsterData(1),
        showAlert  : true,
        isPlayerDed: false,
      };
    }

    // If boss not ded
    const playerHP = player.hp - Sprite.getMonsterDmg(sprites.bossDmg);

    // If player ded
    if (playerHP <= 0) {
      this.resetGame();

      return {
        player: {
          coor: this.sprites.playerCoor,
        },
        monsters   : this.sprites.compileMonsterData(1),
        showAlert  : true,
        isPlayerDed: true,
      };
    }

    // If not, update boss' HP and return
    return {
      boss: {
        ...boss,
        hp: bossHP,
      },
      player: {
        coor: currCoor,
        hp  : playerHP,
      },
    };
  }


  resetGame(dungeonLvl = 1) {
    this.board.initBoard();
    this.sprites.init(this.board, dungeonLvl);
  }
}

export default new Game();
