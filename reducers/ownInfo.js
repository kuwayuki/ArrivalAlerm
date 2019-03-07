const INITIAL_STATE = {
  coords: { latitude: null, longitude: null },
  interval: 'auto',
  isFree: true,
  name: 'Nanasi',
};

export const ownInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_NAME':
      return { ...state, name: action.name };
    case 'DELETE_NAME':
      return { ...state, name: '' };
    default:
      return state;
  }
};
