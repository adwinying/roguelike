import React, { Component } from 'react';
import { connect } from 'react-redux';
import { keyPress } from '../actions';


class Map extends Component {
  
  render() {
    var compiledHtml = [];
    const {map, onPress} = this.props;

    map.forEach(function(row, i){
      var compiledRow = [];
      row.forEach(function(cell, j){
        compiledRow.push(
          <td className='map-cell' 
          	key={j}
          	data-row={i}
          	data-col={j}
            data-val={cell}
          ></td>
        );
      });
      compiledHtml.push(<tr key={i} className="map-row">{compiledRow}</tr>);
    });

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
    	let key = e.key;

    	if (key === 'w' || key === 'ArrowUp') {
	      dispatch(keyPress('MOVE_UP', key));
    	} else if (key === 's' || key === 'ArrowDown') {
	      dispatch(keyPress('MOVE_DOWN', key));
    	} else if (key === 'a' || key === 'ArrowLeft') {
	      dispatch(keyPress('MOVE_LEFT', key));
    	} else if (key === 'd' || key === 'ArrowRight') {
	      dispatch(keyPress('MOVE_RIGHT', key));
    	} 
    }
  };
}

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;