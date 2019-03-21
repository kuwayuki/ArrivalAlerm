import * as DEF from '../constants/constants';

const INITIAL_STATE = {
  coords: { latitude: null, longitude: null, speed: null },
  distance: 100,
  performance: 0,
  isFree: true,
  isRead: false,
  selectedIndex: 0,
};

export const ownInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEF.OWN_INFO.SETTING:
      return {
        ...state,
        isFree: action.setting.isFree,
        distance: Number(action.setting.distance),
        performance: Number(action.setting.performance),
        isRead: true,
      };
    case DEF.OWN_INFO.EDIT_COORDS:
      return {
        ...state,
        coords: {
          latitude: action.coords.latitude,
          longitude: action.coords.longitude,
          speed: action.coords.speed,
          isRead: true,
        },
      };
    case DEF.OWN_INFO.EDIT_SETTING:
      return {
        ...state,
        distance: action.ownInfo.distance,
        performance: action.ownInfo.performance,
        isRead: true,
      };
    case DEF.OWN_INFO.EDIT_SELECTED_INDEX:
      return { ...state, selectedIndex: action.selectedIndex };
    default:
      return state;
  }
};
