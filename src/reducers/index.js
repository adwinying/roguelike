import game from '../classes/Game';
import { initialState } from '../store';


const { board } = game;

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    // Manage popup alerts
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
      const stateToUse = payload.isPlayerDed ? initialState : state;

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
