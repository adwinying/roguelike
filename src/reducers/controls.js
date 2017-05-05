const controls = (state = {lastKeyPresed: null}, action) => {
	if (action.type === 'SHOW_ALERT') {
		return {
			...state,
			showAlert: true,
			isDed: false
		}
	} else if (action.type === 'HIDE_ALERT') {
		return {
			...state,
			showAlert: false
		}
	}

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