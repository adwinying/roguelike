import React, { Component } from 'react';
import { connect } from 'react-redux';
import { keyPress } from '../actions';


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
    map: state.layout
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPress: (e) => {
    	let key = e.key;

    	if (key === 'w' || key === 'ArrowUp') {
	      dispatch(keyPress('MOVE_UP', key));
    	} else if (key === 's' || key === 'ArrowDown') {
	      dispatch(keyPress('MOVE_DOWN', key));
    	} else if (key === 'a' || key === 'ArrowLeft') {
	      dispatch(keyPress('MOVE_LEFT', key));
    	} else if (key === 'd' || key === 'ArrowRight') {
	      dispatch(keyPress('MOVE_RIGHT', key));
    	} else if (key === 'h') {
        dispatch(keyPress('SHOW_ALERT', key));
        setTimeout(() => {
          dispatch(keyPress('HIDE_ALERT', 'h'));
        }, 3000);
      } 
    }
  };
}

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;