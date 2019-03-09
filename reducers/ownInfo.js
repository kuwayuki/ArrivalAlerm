import * as DEF from '../constants/constants';

const INITIAL_STATE = {
  coords: { latitude: null, longitude: null, speed: null },
  interval: 5,
  intervalSetting: 'auto',
  isFree: true,
};

export const ownInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEF.OWN_INFO.EDIT_COORDS:
      return { ...state, coords: action.coords };
    case DEF.OWN_INFO.EDIT_INTERVAL:
      return { ...state, interval: action.interval };
    default:
      return state;
  }
};
