import React, { Component } from 'react';
import { connect } from 'react-redux';

class Stats extends Component {
	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-4 col-sm-2 text-center">
						<h5>HP</h5>
						<span className="stat-val">{this.props.hp}</span>
					</div>
					<div className="col-xs-4 col-sm-2 text-center">
						<h5>XP</h5>
						<span className="stat-val">{this.props.xp}</span>
						<h6 className="stat-subtitle">to next lvl</h6>
					</div>
					<div className="col-xs-4 col-sm-2 text-center">
						<h5>Weapon</h5>
						<span className="stat-val">{this.props.weapon}</span>
					</div>
					<div className="col-xs-4 col-sm-2 text-center">
						<h5>DMG</h5>
						<span className="stat-val">{this.props.dmg}</span>
					</div>
					<div className="col-xs-4 col-sm-2 text-center">
						<h5>Player Lvl</h5>
						<span className="stat-val">{this.props.playerLvl}</span>
					</div>
					<div className="col-xs-4 col-sm-2 text-center">
						<h5>Dungeon Lvl</h5>
						<span className="stat-val">{this.props.dungeonLvl}</span>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    hp: state.stats.hp,
    xp: state.stats.xpToNxtLvl,
    weapon: state.stats.weapon.name,
    dmg: state.stats.dmg,
    playerLvl: state.stats.playerLvl,
    dungeonLvl: state.stats.dungeonLvl
  };
}

const StatsContainer = connect(
  mapStateToProps
)(Stats);

export default StatsContainer;