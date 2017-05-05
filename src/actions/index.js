export const keyPress = (type) => {
	return {
		type
	};
}

export const hideAlert = () => {
	return {
		type: "HIDE_ALERT",
		isDed: false
	};
}

export const toggleDarkness = () => {
	return {
		type: "TOGGLE_DARKNESS"
	}
}