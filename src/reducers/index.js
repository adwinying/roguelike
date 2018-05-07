import Board from '../classes/Board';
import Sprite from '../classes/Sprite';

const board = new Board();
const sprites = new Sprite();

board.initBoard();
sprites.init(board);

const initState = {
  map: {
    layout: board.printMap(sprites.playerCoor, true),
  },
  coor: {
    player: sprites.playerCoor,
  },
  stats: {
    hp        : 100,
    xpToNxtLvl: 100,
    weapon    : sprites.weaponList[0],
    dmg       : Sprite.getPlayerDmg(sprites.weaponList[0], 1),
    playerLvl : 1,
    dungeonLvl: 1,
  },
  monsters      : sprites.compileMonsterData(1),
  boss          : sprites.compileBossData(1),
  showAlert     : false,
  isPlayerDed   : false,
  isDarknessOn  : true,
  isGuideEnabled: false,
};

const reducer = (state = initState, action) => {
  let targetCellCoor = {};
  const currCellCoor = state.coor.player;
  const { row, col } = state.coor.player;

  switch (action.type) {
    // Manage popup alerts
    case 'SHOW_ALERT':
      return {
        ...state,
        showAlert  : true,
        isPlayerDed: false,
      };

    case 'HIDE_ALERT':
      return {
        ...state,
        showAlert: false,
      };

    // Manage toggle darkness
    case 'TOGGLE_DARKNESS':
      return {
        ...state,
        map: {
          layout: board.printMap(state.coor.player, !state.isDarknessOn),
        },
        isDarknessOn: !state.isDarknessOn,
      };

    // Manage toggle guide
    case 'TOGGLE_GUIDE':
      return {
        ...state,
        isGuideEnabled: !state.isGuideEnabled,
      };

    // Manage user controls
    case 'MOVE_UP':
      targetCellCoor = { ...currCellCoor, row: row - 1 };
      break;

    case 'MOVE_DOWN':
      targetCellCoor = { ...currCellCoor, row: row + 1 };
      break;

    case 'MOVE_LEFT':
      targetCellCoor = { ...currCellCoor, col: col - 1 };
      break;

    case 'MOVE_RIGHT':
      targetCellCoor = { ...currCellCoor, col: col + 1 };
      break;

    default:
      return state;
  }

  const cellState = board.getCell(targetCellCoor.row, targetCellCoor.col);

  // empty cell
  if (cellState === 0) {
    board.movePlayer(currCellCoor, targetCellCoor);
    return {
      ...state,
      map: {
        layout: board.printMap(targetCellCoor, state.isDarknessOn),
      },
      coor: {
        player: targetCellCoor,
      },
    };

  // monster cell
  } else if (cellState === 2) {
    const monsterBaseXp = 10;
    const playerBaseXp  = 80;
    const monsterIndex  = Sprite.getMonsterIndex(state.monsters, targetCellCoor);
    const monsterHP     = state.monsters[monsterIndex].hp - state.stats.dmg;
    const newMonsters   = state.monsters.filter((monster, index) => index !== monsterIndex);
    let newHP   = state.stats.hp;

    // console.log(monsterIndex, monsterHP, newMonsters);

    if (monsterIndex === -1) {
      throw new Error('monsterIndex not found!');
    }

    // If monster ded
    if (monsterHP <= 0) {
      let newXP  = state.stats.xpToNxtLvl - (monsterBaseXp * state.stats.dungeonLvl);
      let newLvl = state.stats.playerLvl;

      if (newXP <= 0) {
        newLvl = state.stats.playerLvl + 1;
        newHP += (20 * newLvl);
        newXP = newXP + playerBaseXp + (20 * newLvl);
      }

      board.setCell(targetCellCoor.row, targetCellCoor.col, 0);
      return {
        ...state,
        map: {
          layout: board.printMap(currCellCoor, state.isDarknessOn),
        },
        monsters: newMonsters,
        stats   : {
          ...state.stats,
          hp        : newHP,
          xpToNxtLvl: newXP,
          playerLvl : newLvl,
          dmg       : Sprite.getPlayerDmg(state.stats.weapon, newLvl),
        },
      };
    }

    // If monster not ded
    newHP = state.stats.hp - Sprite.getMonsterDmg(state.stats.dungeonLvl);

    // If player ded
    if (newHP <= 0) {
      board.initBoard();
      sprites.init(board);

      return {
        ...initState,
        map: {
          layout: board.printMap(sprites.playerCoor, state.isDarknessOn),
        },
        coor: {
          player: sprites.playerCoor,
        },
        monsters    : sprites.compileMonsterData(1),
        showAlert   : true,
        isPlayerDed : true,
        isDarknessOn: state.isDarknessOn,
      };
    }

    // If not, update monster data's HP and return
    newMonsters.push({
      ...targetCellCoor,
      hp: monsterHP,
    });

    return {
      ...state,
      monsters: newMonsters,
      stats   : {
        ...state.stats,
        hp: newHP,
      },
    };


  // weapon cell
  } else if (cellState === 3) {
    board.movePlayer(currCellCoor, targetCellCoor);
    return {
      ...state,
      map: {
        layout: board.printMap(targetCellCoor, state.isDarknessOn),
      },
      coor: {
        player: targetCellCoor,
      },
      stats: {
        ...state.stats,
        weapon: sprites.getNextWeapon(state.stats.dungeonLvl),
        dmg   : Sprite.getPlayerDmg(sprites.getNextWeapon(state.stats.dungeonLvl), state.stats.playerLvl),
      },
    };

  // exit cell
  } else if (cellState === 4) {
    board.initBoard();
    sprites.init(board, state.stats.dungeonLvl + 1);

    return {
      ...state,
      map: {
        layout: board.printMap(sprites.playerCoor, state.isDarknessOn),
      },
      coor: {
        player: sprites.playerCoor,
      },
      stats: {
        ...state.stats,
        dungeonLvl: state.stats.dungeonLvl + 1,
      },
      boss    : sprites.compileBossData(),
      monsters: sprites.compileMonsterData(state.stats.dungeonLvl + 1),
    };

  // health cell
  } else if (cellState === 6) {
    board.movePlayer(currCellCoor, targetCellCoor);
    return {
      ...state,
      map: {
        layout: board.printMap(targetCellCoor, state.isDarknessOn),
      },
      coor: {
        player: targetCellCoor,
      },
      stats: {
        ...state.stats,
        hp: state.stats.hp + 20,
      },
    };

  // boss cell
  } else if (cellState === 7) {
    const bossHP = state.boss.hp - state.stats.dmg;
    let playerHP = state.stats.hp;

    // If boss ded
    if (bossHP <= 0) {
      board.initBoard();
      sprites.init(board);

      return {
        ...initState,
        map: {
          layout: board.printMap(sprites.playerCoor, state.isDarknessOn),
        },
        coor: {
          player: sprites.playerCoor,
        },
        monsters    : sprites.compileMonsterData(1),
        showAlert   : true,
        isPlayerDed : false,
        isDarknessOn: state.isDarknessOn,
      };
    }

    // If boss not ded
    playerHP = state.stats.hp - Sprite.getMonsterDmg(8);

    // If player ded
    if (playerHP <= 0) {
      board.initBoard();
      sprites.init(board);

      return {
        ...initState,
        map: {
          layout: board.printMap(sprites.playerCoor, state.isDarknessOn),
        },
        coor: {
          player: sprites.playerCoor,
        },
        showAlert   : true,
        monsters    : sprites.compileMonsterData(1),
        isPlayerDed : true,
        isDarknessOn: state.isDarknessOn,
      };
    }

    // If not, update boss' HP and return
    return {
      ...state,
      boss: {
        ...state.boss,
        hp: bossHP,
      },
      stats: {
        ...state.stats,
        hp: playerHP,
      },
    };
  }

  return state;
};

export default reducer;
