const controls = (state = {lastKeyPresed: null}, action) => {
	if(action.keyPressed) {
		return {
			...state,
			lastKeyPresed: action.keyPressed
		};
	} else {
		return state;
	}
	
};

export default controls