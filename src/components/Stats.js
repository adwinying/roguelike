import React from 'react';
import { connect } from 'react-redux';

const Stats = props => (
  <div className="container">
    <div className="row">
      <div className="col-xs-4 col-sm-2 text-center">
        <h5>HP</h5>
        <span className="stat-val">{props.hp}</span>
      </div>
      <div className="col-xs-4 col-sm-2 text-center">
        <h5>XP</h5>
        <span className="stat-val">{props.xp}</span>
        <h6 className="stat-subtitle">to next lvl</h6>
      </div>
      <div className="col-xs-4 col-sm-2 text-center">
        <h5>Weapon</h5>
        <span className="stat-val">{props.weapon}</span>
      </div>
      <div className="col-xs-4 col-sm-2 text-center">
        <h5>DMG</h5>
        <span className="stat-val">{props.dmg}</span>
      </div>
      <div className="col-xs-4 col-sm-2 text-center">
        <h5>Player Lvl</h5>
        <span className="stat-val">{props.playerLvl}</span>
      </div>
      <div className="col-xs-4 col-sm-2 text-center">
        <h5>Dungeon Lvl</h5>
        <span className="stat-val">{props.dungeonLvl}</span>
      </div>
    </div>
  </div>
);

const mapStateToProps = ({ player, dungeonLvl }) => ({
  hp       : player.hp,
  xp       : player.xpToNxtLvl,
  weapon   : player.weapon.name,
  dmg      : player.dmg,
  playerLvl: player.lvl,
  dungeonLvl,
});

const StatsContainer = connect(mapStateToProps)(Stats);

export default StatsContainer;
