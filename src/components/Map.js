import React from 'react';
import { connect } from 'react-redux';
import { movePlayer, toggleDarkness, toggleGuide } from '../actions';


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

const mapStateToProps = ({ map }) => ({
  map,
});

const mapDispatchToProps = dispatch => ({
  onPress: ({ key }) => {
    switch (key) {
      case 'w':
      case 'ArrowUp':
        dispatch(movePlayer('UP'));
        break;

      case 's':
      case 'ArrowDown':
        dispatch(movePlayer('DOWN'));
        break;

      case 'a':
      case 'ArrowLeft':
        dispatch(movePlayer('LEFT'));
        break;

      case 'd':
      case 'ArrowRight':
        dispatch(movePlayer('RIGHT'));
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
