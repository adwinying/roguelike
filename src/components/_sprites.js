export default class Sprites {
	constructor() {
		this.exitCoor = {};
		this.playerCoor = {};
		this.weaponCoor = {};
		this.healthCoor = [];
		this.monsterCoor = [];
		this.weaponList = [
			{
				name: 'Stick',
				baseDmg: 3,
			},
			{
				name: 'Dagger',
				baseDmg: 6,
			},
			{
				name: 'Spear',
				baseDmg: 11,
			},
			{
				name: 'Crossbow',
				baseDmg: 16,
			},
			{
				name: 'Katana',
				baseDmg: 22,
			},
			{
				name: 'Scythe',
				baseDmg: 28,
			}
		];

	}

	init(game) {
		var spriteCoor = [];
		var indexArr = [];
		this.monsterCoor = [];
		this.healthCoor  = [];

		while(indexArr.length < 20) {
			var randNum = Math.floor(Math.random() * game.playArea.length);
			if( indexArr.indexOf(randNum) === -1 ) {
				indexArr.push(randNum);
			}
		}

		indexArr.forEach((index)=> {
			spriteCoor.push(game.playArea[index]);
		});
		
		for(var i=0; i<spriteCoor.length; i++){
			var row = spriteCoor[i].r;
			var col = spriteCoor[i].c;
			if(i < 10) {
				//Set monsters
				game.setCell(row, col, 2);
				this.monsterCoor.push(spriteCoor[i]);
			} else if (i >= 10 && i < 17) {
				//Set health boosters
				game.setCell(row, col, 6);
				this.healthCoor.push(spriteCoor[i]);
			} else if (i === 17) {
				//Set weapon
				game.setCell(row, col, 3);
				this.weaponCoor = spriteCoor[i];
			} else if (i === 18) {
				//Set exit
				game.setCell(row, col, 4);
				this.exitCoor = spriteCoor[i];
			} else if (i === 19) {
				//Set player spawn location
				game.setCell(row, col, 5);
				this.playerCoor = spriteCoor[i];
			}
		}
	}

	compileMonsterData(DungeonLvl) {
		const monsterData = this.monsterCoor.map((coor) => {
			return {
				...coor,
				hp: 15 + (10 * DungeonLvl)
			}
		});

		return monsterData;
	}

	getNextWeapon(DungeonLvl) {
		return this.weaponList[DungeonLvl];
	}

	getMonsterDmg(DungeonLvl) {
		const monsterBaseDmg = 3;
		var randNum = Math.floor(Math.random() * 4);

		return (monsterBaseDmg * DungeonLvl) + randNum;
	}

	getMonsterIndex(array, obj) {
		for(var i=0; i<array.length; i++){
			if(array[i].r === obj.r && array[i].c === obj.c) {
				return i;
			}
		}

		return -1;
	}

	getCurrDmg(currWeapon, playerLvl) {
		return currWeapon.baseDmg + (0.5 * playerLvl * (playerLvl+1) * 5);
	}
}