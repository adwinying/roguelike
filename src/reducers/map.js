import Board from '../components/_maplogic';
import Sprites from '../components/_sprites';

const game = new Board(100);
const sprites = new Sprites();
game.init();
sprites.init(game);

const initState = {
	layout: game.getLayout(sprites.playerCoor),
	exitCoor: sprites.exitCoor,
	healthCoor: sprites.healthCoor,
	weaponCoor: sprites.weaponCoor,
	monsterCoor: sprites.monsterCoor,
	playerCoor: sprites.playerCoor
}

const map = (state = initState, action) => {
	var targetCellCoor = {};
	var currCellCoor = state.playerCoor;

	switch (action.type) {
		case 'MOVE_UP':
			targetCellCoor = {...currCellCoor, r: currCellCoor.r-1};
			break;

		case 'MOVE_DOWN':
			targetCellCoor = {...currCellCoor, r: currCellCoor.r+1};
			break;

		case 'MOVE_LEFT':
			targetCellCoor = {...currCellCoor, c: currCellCoor.c-1};
			break;

		case 'MOVE_RIGHT':
			targetCellCoor = {...currCellCoor, c: currCellCoor.c+1};
			break;

		default:
			return state;
	}

	if (game.movePlayer(currCellCoor, targetCellCoor)) {
		var obj = {
			...state,
			playerCoor: targetCellCoor,
			layout: game.getLayout(targetCellCoor)
		};
		return obj;
	} else {
		return state;
	}

};

export default map