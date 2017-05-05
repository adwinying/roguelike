import Board from '../components/_maplogic';
import Sprites from '../components/_sprites';

const game = new Board(100);
const sprites = new Sprites();

game.init();
sprites.init(game);

const initState = {
	layout: game.getLayout(sprites.playerCoor),
	coor: {
		player: sprites.playerCoor
	},
	stats: {
		hp: 100,
		xpToNxtLvl: 100,
		weapon: sprites.weaponList[0],
		dmg: sprites.getCurrDmg(sprites.weaponList[0], 1),
		playerLvl: 1,
		dungeonLvl: 1
	},
	monsterData: sprites.compileMonsterData(1)
}

const map = (state = initState, action) => {
	var targetCellCoor = {};
	const currCellCoor = state.coor.player;
	const {r, c} = state.coor.player;

	switch (action.type) {
		case 'MOVE_UP':
			targetCellCoor = {...currCellCoor, r: r-1};
			break;

		case 'MOVE_DOWN':
			targetCellCoor = {...currCellCoor, r: r+1};
			break;

		case 'MOVE_LEFT':
			targetCellCoor = {...currCellCoor, c: c-1};
			break;

		case 'MOVE_RIGHT':
			targetCellCoor = {...currCellCoor, c: c+1};
			break;

		default:
			return state;
	}

	const cellState = game.getStat(targetCellCoor.r, targetCellCoor.c);

	//empty cell
	if (cellState === 0) {
		game.movePlayer(currCellCoor, targetCellCoor)
		return {
			...state,
			layout: game.getLayout(targetCellCoor),
			coor: {
				...state.coor, 
				player: targetCellCoor
			}
		};

	//monster cell
	} else if (cellState === 2) {
		const monsterBaseXp = 10;
		const playerBaseXp  = 80;
		let monsterIndex = sprites.getMonsterIndex(state.monsterData, targetCellCoor);
		let monsterHP = state.monsterData[monsterIndex].hp - state.stats.dmg;
		var newMonsterData = state.monsterData.filter((monster, index) => {
			return index !== monsterIndex;
		});
		var newHP	 = state.stats.hp;

		//console.log(monsterIndex, monsterHP, newMonsterData);

		if (monsterIndex === -1) {
			console.error('monsterIndex not found!');
			return state;
		}

		if (monsterHP <= 0) {
			var newXP  = state.stats.xpToNxtLvl - (monsterBaseXp * state.stats.dungeonLvl);
			var newLvl = state.stats.playerLvl;

			if (newXP <= 0) {
				newLvl = state.stats.playerLvl + 1;
				newHP  += (20 * newLvl);
				newXP  = newXP + playerBaseXp + (20 * newLvl);
			}	

			game.setCell(targetCellCoor.r, targetCellCoor.c, 0);
			return {
				...state,
				layout: game.getLayout(currCellCoor),
				monsterData: newMonsterData,
				stats: {
					...state.stats,
					hp: newHP,
					xpToNxtLvl: newXP,
					playerLvl: newLvl,
					dmg: sprites.getCurrDmg(state.stats.weapon, newLvl)
				}
			};

		} else {
			newHP = state.stats.hp - sprites.getMonsterDmg(state.stats.dungeonLvl);

			newMonsterData.push({
				...targetCellCoor, 
				hp: monsterHP});

			return {
				...state,
				monsterData: newMonsterData,
				stats: {
					...state.stats, 
					hp: newHP
				}
			}
		}

	//weapon cell
	} else if (cellState === 3) {
		game.movePlayer(currCellCoor, targetCellCoor)
		return {
			...state,
			layout: game.getLayout(targetCellCoor),
			coor: {
				...state.coor, 
				player: targetCellCoor
			},
			stats: {
				...state.stats, 
				weapon: sprites.getNextWeapon(state.stats.dungeonLvl),
				dmg: sprites.getCurrDmg(sprites.getNextWeapon(state.stats.dungeonLvl), state.stats.playerLvl)
			}
		};

	//exit cell
	} else if (cellState === 4) {
		game.init();
		sprites.init(game);

		return {
			layout: game.getLayout(sprites.playerCoor),
			coor: {
				player: sprites.playerCoor
			},
			stats: {
				...state.stats,
				dungeonLvl: state.stats.dungeonLvl + 1
			},
			monsterData: sprites.compileMonsterData(state.stats.dungeonLvl + 1)
		}

	//health cell
	} else if (cellState === 6) {
		game.movePlayer(currCellCoor, targetCellCoor)
		return {
			...state,
			layout: game.getLayout(targetCellCoor),
			coor: {
				...state.coor, 
				player: targetCellCoor
			},
			stats: {
				...state.stats, 
				hp: state.stats.hp + 20
			}
		};

	} else {
		return state;
	}

};

export default map