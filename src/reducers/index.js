import Board from '../components/_maplogic';
import Sprites from '../components/_sprites';

const game = new Board(100);
const sprites = new Sprites();

game.init();
sprites.init(game);

const initState = {
	map: {
		layout: game.getLayout(sprites.playerCoor, true)
	},
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
	monsterData: sprites.compileMonsterData(1),
	boss: sprites.compileBossData(1),
	showAlert: false,
	isPlayerDed: false,
	isDarknessOn: true,
	isGuideEnabled: false
}

const reducer = (state = initState, action) => {
	var targetCellCoor = {};
	const currCellCoor = state.coor.player;
	const {r, c} = state.coor.player;

	switch (action.type) {
		//Manage popup alerts
		case 'SHOW_ALERT':
			return {
				...state,
				showAlert: true,
				isPlayerDed: false
			};

		case 'HIDE_ALERT':
			return {
				...state,
				showAlert: false
			};

		//Manage toggle darkness
		case 'TOGGLE_DARKNESS':
			return {
				...state,
				map: {
					layout: game.getLayout(state.coor.player, !state.isDarknessOn)
				},
				isDarknessOn: !state.isDarknessOn
			}

		//Manage toggle guide
		case 'TOGGLE_GUIDE':
			return {
				...state,
				isGuideEnabled: !state.isGuideEnabled
			}

		//Manage user controls
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
			map: {
				layout: game.getLayout(targetCellCoor, state.isDarknessOn)
			},
			coor: {
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

		//If monster ded
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
				map: {
					layout: game.getLayout(currCellCoor, state.isDarknessOn)
				},
				monsterData: newMonsterData,
				stats: {
					...state.stats,
					hp: newHP,
					xpToNxtLvl: newXP,
					playerLvl: newLvl,
					dmg: sprites.getCurrDmg(state.stats.weapon, newLvl)
				}
			};

		//If monster not ded
		} else {
			newHP = state.stats.hp - sprites.getMonsterDmg(state.stats.dungeonLvl);

			//If player ded
			if (newHP <= 0) {
				game.init();
				sprites.init(game);

				return {
					...initState,
					map: {
						layout: game.getLayout(sprites.playerCoor, state.isDarknessOn)
					},
					coor: {
						player: sprites.playerCoor
					},
					monsterData: sprites.compileMonsterData(1),
					showAlert: true,
					isPlayerDed: true,
				};
			}

			//If not, update monster data's HP and return
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
			};
		}

	//weapon cell
	} else if (cellState === 3) {
		game.movePlayer(currCellCoor, targetCellCoor)
		return {
			...state,
			map: {
				layout: game.getLayout(targetCellCoor, state.isDarknessOn)
			},
			coor: {
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
		sprites.init(game, state.stats.dungeonLvl + 1);

		return {
			...state,
			map: {
				layout: game.getLayout(sprites.playerCoor, state.isDarknessOn)
			},
			coor: {
				player: sprites.playerCoor
			},
			stats: {
				...state.stats,
				dungeonLvl: state.stats.dungeonLvl + 1
			},
			boss: sprites.compileBossData(),
			monsterData: sprites.compileMonsterData(state.stats.dungeonLvl + 1)
		}

	//health cell
	} else if (cellState === 6) {
		game.movePlayer(currCellCoor, targetCellCoor)
		return {
			...state,
			map: {
				layout: game.getLayout(targetCellCoor, state.isDarknessOn)
			},
			coor: {
				player: targetCellCoor
			},
			stats: {
				...state.stats, 
				hp: state.stats.hp + 20
			}
		};

	//boss cell
	} else if (cellState === 7) {
		let bossHP   = state.boss.hp - state.stats.dmg;
		var playerHP = state.stats.hp;

		//If boss ded
		if (bossHP <= 0) {
			game.init();
			sprites.init(game);

			return {
				...initState,
				map: {
					layout: game.getLayout(sprites.playerCoor, state.isDarknessOn)
				},
				coor: {
					player: sprites.playerCoor
				},
				monsterData: sprites.compileMonsterData(1),
				showAlert: true,
				isPlayerDed: false,
			};

		//If boss not ded
		} else {
			playerHP = state.stats.hp - sprites.getMonsterDmg(8);

			//If player ded
			if (playerHP <= 0) {
				game.init();
				sprites.init(game);

				return {
					...initState,
					map: {
						layout: game.getLayout(sprites.playerCoor, state.isDarknessOn)
					},
					coor: {
						player: sprites.playerCoor
					},
					showAlert: true,
					isPlayerDed: true,
					monsterData: sprites.compileMonsterData(1),
				};
			}

			//If not, update boss' HP and return
			return {
				...state,
				boss: {
					...state.boss,
					hp: bossHP
				},
				stats: {
					...state.stats, 
					hp: playerHP
				}
			}
		}

	} else {
		return state;
	}

};

export default reducer;