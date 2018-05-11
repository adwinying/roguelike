import React from 'react';
import { connect } from 'react-redux';
import { keyPress, toggleDarkness, toggleGuide } from '../actions';


const GameMap = ({ map, onPress }) => {
  const compiledHtml = [];

  for (let i = 0; i < map.length; i += 1) {
    const row = map[i];
    const compiledRow = [];
    for (let j = 0; j < row.length; j += 1) {
      compiledRow.push(<td
        className="map-cell"
        key={j}
        data-row={i}
        data-col={j}
        data-val={row[j]}
      />);
    }
    compiledHtml.push(<tr key={i} className="map-row">{compiledRow}</tr>);
  }

  return (
    <div className="container map-board">
      <table tabIndex="0" onKeyDown={onPress}>
        <tbody>
          {compiledHtml}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => ({
  map: state.map,
});

const mapDispatchToProps = dispatch => ({
  onPress: (e) => {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        dispatch(keyPress('MOVE_UP'));
        break;

      case 's':
      case 'ArrowDown':
        dispatch(keyPress('MOVE_DOWN'));
        break;

      case 'a':
      case 'ArrowLeft':
        dispatch(keyPress('MOVE_LEFT'));
        break;

      case 'd':
      case 'ArrowRight':
        dispatch(keyPress('MOVE_RIGHT'));
        break;

      case 'f':
        dispatch(toggleDarkness());
        break;

      case 'h':
        dispatch(toggleGuide());
        break;

      default:
        break;
    }
  },
});

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameMap);

export default MapContainer;
