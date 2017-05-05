import React, { Component } from 'react';
import { connect } from 'react-redux';
import { keyPress, toggleDarkness, toggleGuide } from '../actions';


class Map extends Component {
  
  render() {
    var compiledHtml = [];
    const {map, onPress} = this.props;

    for (var i=0; i<map.length; i++) {
      var row = map[i];
      var compiledRow = [];
      for (var j=0; j<row.length; j++) {
        compiledRow.push(
          <td className='map-cell' 
          	key={j}
          	data-row={i}
          	data-col={j}
            data-val={row[j]}
          ></td>
        );
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
  }
}

const mapStateToProps = (state) => {
  return {
    map: state.map.layout
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
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
    }
  };
}

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;