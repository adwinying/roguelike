import { createStore } from 'redux';
import reducers from './reducers';

import { gameConst as params } from './constants';
import game from './classes/Game';
import Sprite from './classes/Sprite';


const { board, sprites } = game;

export const initialState = {
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


const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
