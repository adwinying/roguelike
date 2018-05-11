import Game from '../classes/Game';
import Sprite from '../classes/Sprite';

const game = new Game();
const { board, sprites } = game;

const initState = {
  map   : board.printMap(sprites.playerCoor, true),
  player: {
    coor      : sprites.playerCoor,
    hp        : 100,
    xpToNxtLvl: 100,
    weapon    : sprites.weaponList[0],
    dmg       : Sprite.getPlayerDmg(sprites.weaponList[0], 1),
    lvl       : 1,
  },
  dungeonLvl    : 1,
  monsters      : sprites.compileMonsterData(1),
  boss          : sprites.compileBossData(1),
  showAlert     : false,
  isPlayerDed   : false,
  isDarknessOn  : true,
  isGuideEnabled: false,
};

const reducer = (state = initState, action) => {
  let targetCellCoor = {};
  const currCellCoor = state.player.coor;
  const { row, col } = state.player.coor;

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
        map: board.printMap(
          state.player.coor,
          !state.isDarknessOn,
        ),
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

  const moveResults = game.movePlayer(
    currCellCoor,
    targetCellCoor,
    state.player,
    state.monsters,
    state.boss,
    state.dungeonLvl,
  );

  const stateToUse = moveResults.isPlayerDed ? initState : state;

  return {
    ...stateToUse,
    ...moveResults,
    map: board.printMap(
      moveResults.player.coor,
      stateToUse.isDarknessOn,
    ),
    player: {
      ...stateToUse.player,
      ...moveResults.player,
    },
  };
};

export default reducer;
