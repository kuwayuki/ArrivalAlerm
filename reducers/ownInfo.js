import * as DEF from '../constants/constants';

const INITIAL_STATE = {
  coords: { latitude: null, longitude: null, speed: null },
  interval: 5,
  intervalSetting: 'auto',
  isFree: true,
  selectedIndex: 0,
};

export const ownInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEF.OWN_INFO.SETTING:
      return {
        ...state,
        isFree: action.setting.isFree,
      };
    case DEF.OWN_INFO.EDIT_COORDS:
      return {
        ...state,
        coords: {
          latitude: action.coords.latitude,
          longitude: action.coords.longitude,
          speed: action.coords.speed,
        },
      };
    case DEF.OWN_INFO.EDIT_INTERVAL:
      return { ...state, interval: action.interval };
    case DEF.OWN_INFO.EDIT_SELECTED_INDEX:
      return { ...state, selectedIndex: action.selectedIndex };
    default:
      return state;
  }
};
