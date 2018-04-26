export const keyPress = type => ({
  type,
});

export const hideAlert = () => ({
  type : 'HIDE_ALERT',
  isDed: false,
});

export const toggleDarkness = () => ({
  type: 'TOGGLE_DARKNESS',
});

export const toggleGuide = () => ({
  type: 'TOGGLE_GUIDE',
});
