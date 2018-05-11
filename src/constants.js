export const spriteConst = {
  weapons: [
    {
      name   : 'Stick',
      baseDmg: 2,
    },
    {
      name   : 'Dagger',
      baseDmg: 5,
    },
    {
      name   : 'Spear',
      baseDmg: 11,
    },
    {
      name   : 'Crossbow',
      baseDmg: 16,
    },
    {
      name   : 'Katana',
      baseDmg: 22,
    },
    {
      name   : 'Scythe',
      baseDmg: 28,
    },
  ],
  cell: {
    empty  : 0,
    wall   : 1,
    monster: 2,
    weapon : 3,
    exit   : 4,
    player : 5,
    health : 6,
    boss   : 7,
    hidden : 8,
  },
  maxLevel            : 5,
  bossHP              : 500,
  bossDmg             : 8, // Dmg equivalent to monster in lvl 8
  playerDmgMultiplier : 6,
  monsterBaseHP       : 5,
  monsterHPMultiplier : 20,
  monsterBaseDmg      : 3,
  monsterDmgMultiplier: 4,
};

export const gameConst = {
  monsterBaseXP: 10,
  playerBaseXP : 80,
  healthCellHP : 20,
  initial      : {
    playerHP  : 100,
    xpToNxtLvl: 100,
  },
};

export const boardConst = {
  boardSize          : 100,
  scrambleRounds     : 7,
  cellWallToFreeRatio: 0.28,
  playableAreaRatio  : 0.25,
  displaySizeX       : 60,
  displaySizeY       : 40,
};
