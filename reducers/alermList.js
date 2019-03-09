import * as DEF from '../constants/constants';

const INITIAL_ITEM = {
  index: 0,
  title: '川崎駅',
  isAvailable: true,
  isAlermed: false,
  alermMessage: '目的地に到着しました。',
  alermDistance: 1000,
  distance: 12345, // いる？
  interval: 'auto',
  coords: { latitude: 35.53136621897242, longitude: 139.6968913078308 },
  timeZoneStart: '5:00',
  timeZoneEnd: '12:00',
};

const INITIAL_ITEM_2 = {
  index: 7,
  title: '',
  isAvailable: true,
  isAlermed: false,
  alermMessage: '目的地に到着しました。',
  alermDistance: '1000',
  distance: '0', // いる？
  interval: 'auto',
  coords: { latitude: null, longitude: null },
  timeZoneStart: '5:00',
  timeZoneEnd: '12:00',
};

const INITIAL_STATE = [
];

export const alermList = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEF.ALERM_LIST.ADD:
      return [...state, action.alermItem];
    case DEF.ALERM_LIST.EDIT:
      return state.map(el =>
        el.index === action.index ? action.alermItem : el
      );
    case DEF.ALERM_LIST.DELETE:
      // state.filter(el => console.log(el));
      return state.filter(el => el.index !== action.index);
    case DEF.ALERM_LIST.EDIT_AVAILABLE:
      var temp = state[action.index];
      temp.isAvailable = !temp.isAvailable;
      return state.map(el => (el.index === action.index ? temp : el));
    default:
      return state;
  }
};
