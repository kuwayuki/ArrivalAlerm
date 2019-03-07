import * as DEF from '../constants/constants';

const INITIAL_STATE = [
  INITIAL_ITEM,
  INITIAL_ITEM,
  INITIAL_ITEM,
  INITIAL_ITEM,
  INITIAL_ITEM,
  INITIAL_ITEM,
  INITIAL_ITEM,
  INITIAL_ITEM,
  INITIAL_ITEM,
  INITIAL_ITEM,
];

const INITIAL_ITEM = {
  index: 0,
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

const alermList = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEF.ALERM_LIST.ADD:
      return { ...state, name: action.name };
    case DEF.ALERM_LIST.EDIT:
      return { ...state, name: action.name };
    case DEF.ALERM_LIST.DELETE:
      return { ...state, name: '' };
    default:
      return state;
  }
};
