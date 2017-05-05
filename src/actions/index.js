export const keyPress = (type, keyPressed) => {
	return {
		type,
		keyPressed
	};
}

export const hideAlert = () => {
	return {
		type: "HIDE_ALERT",
		isDed: false
	};
}