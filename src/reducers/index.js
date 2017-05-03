import { combineReducers } from 'redux';
import controls from './controls';
import map from './map';


const reducers = combineReducers({
	controls,
	map
});


export default reducers;