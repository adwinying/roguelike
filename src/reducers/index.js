import game from '../classes/Game';
import Sprite from '../classes/Sprite';

import { gameConst as params } from '../constants';

const { board, sprites } = game;

const initState = {
  map   : board.printMap(sprites.playerCoor, true),
  player: {
    coor      : sprites.playerCoor,
    hp        : params.initial.playerHP,
    xpToNxtLvl: params.initial.xpToNxtLvl,
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

const reducer = (state = initState, { type, payload }) => {
  switch (type) {
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

    // Move player
    case 'MOVE_PLAYER': {
      const stateToUse = payload.isPlayerDed ? initState : state;

      return {
        ...stateToUse,
        ...payload,
        map: board.printMap(
          payload.player.coor,
          stateToUse.isDarknessOn,
        ),
        player: {
          ...stateToUse.player,
          ...payload.player,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
