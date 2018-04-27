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
    free  : 0,
    wall  : 1,
    player: 5,
  },
};

export const gameConst = {

};

export const boardConst = {
  boardSize          : 100,
  randomizeCount     : 7,
  randomizerThreshold: 0.28,
  playableAreaRatio  : 0.25,
  fieldSizeX         : 60,
  fieldSizeY         : 40,
};
