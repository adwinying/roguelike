import React from 'react';
import { connect } from 'react-redux';
import { toggleGuide } from '../actions';

const Guide = (props) => {
  let className = 'rogue-guide modal';

  if (props.isGuideEnabled) {
    className += ' active';
  }

  return (
    <div className={className}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <button type="button" className="close" onClick={props.onClick}>&times;</button>
            <h2>Help</h2>
            <h3>Legend</h3>
            <p>
              <span className="guide-cell map-cell" data-val="1" />
              <strong>Wall </strong> <br />
              <small>Just your average wall.</small>
            </p>
            <p>
              <span className="guide-cell map-cell" data-val="2" />
              <strong>Monster </strong> <br />
              <small>Kill monsters to gain XP.</small>
            </p>
            <p>
              <span className="guide-cell map-cell" data-val="3" />
              <strong>Weapon </strong> <br />
              <small>Equip a better weapon to deal more DMG.</small>
            </p>
            <p>
              <span className="guide-cell map-cell" data-val="4" />
              <strong>Exit </strong> <br />
              <small>Go up a dungeon level. 5 in total.</small>
            </p>
            <p>
              <span className="guide-cell map-cell" data-val="5" />
              <strong>Player </strong> <br />
              <small>Thats you.</small>
            </p>
            <p>
              <span className="guide-cell map-cell" data-val="6" />
              <strong>HP Booster </strong> <br />
              <small>Increase your HP.</small>
            </p>
            <p>
              <span className="guide-cell map-cell" data-val="7" />
              <strong>Boss </strong> <br />
              <small>Defeat the boss in the last dungeon level to win the game!</small>
            </p>

            <h3>Controls</h3>
            <p>
              <span className="rogue-key">w</span>
              <span className="rogue-key">a</span>
              <span className="rogue-key">s</span>
              <span className="rogue-key">d</span>
              &nbsp;or&nbsp;
              <span className="rogue-key">&uarr;</span>
              <span className="rogue-key">&larr;</span>
              <span className="rogue-key">&darr;</span>
              <span className="rogue-key">&rarr;</span>
              Control the player.
            </p>
            <p>
              <span className="rogue-key">f</span>
              Toggle darkness.
            </p>
            <p>
              <span className="rogue-key">h</span>
              Toggle this guide.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isGuideEnabled: state.isGuideEnabled,
});

const mapDispatchToProps = dispatch => ({
  onClick: (e) => {
    e.preventDefault();
    dispatch(toggleGuide());
  },
});

const GuideContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Guide);

export default GuideContainer;
