import store from '../store';
import game from '../classes/Game';

export const movePlayer = (direction) => {
  const state      = store.getState();
  const currCoor   = state.player.coor;
  const targetCoor = { ...currCoor };

  switch (direction) {
    case 'UP':
      targetCoor.row -= 1;
      break;

    case 'DOWN':
      targetCoor.row += 1;
      break;

    case 'LEFT':
      targetCoor.col -= 1;
      break;

    case 'RIGHT':
      targetCoor.col += 1;
      break;

    default:
      throw new Error('Invalid direction!');
  }

  const moveResults = game.movePlayer(
    currCoor,
    targetCoor,
    state.player,
    state.monsters,
    state.boss,
    state.dungeonLvl,
  );

  return {
    type   : 'MOVE_PLAYER',
    payload: moveResults,
  };
};

export const hideAlert = () => ({
  type: 'HIDE_ALERT',
});

export const toggleDarkness = () => ({
  type: 'TOGGLE_DARKNESS',
});

export const toggleGuide = () => ({
  type: 'TOGGLE_GUIDE',
});
