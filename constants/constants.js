let unique = '_NAME';
export const ALERM_LIST = {
  ADD: 'ADD' + unique,
  EDIT: 'EDIT' + unique,
  DELETE: 'DELETE' + unique,
  REFLESH: 'REFLESH' + unique,
  EDIT_AVAILABLE: 'EDIT_AVAILABLE' + unique,
};

unique = '_OWN_INFO';
export const OWN_INFO = {
  EDIT_COORDS: 'EDIT_COORDS' + unique,
  EDIT_INTERVAL: 'EDIT_INTERVAL' + unique,
};

export const VIBRATION_PATTERN = {
  PTN_1: [1000, 2000, 3000],
  PTN_2: [1000, 2000, 3000],
  PTN_3: [1000, 2000, 3000],
};

export const INITIAL_ITEM = {
  index: 0,
  title: '現在地点',
  isAvailable: true,
  isAlermed: false,
  alermMessage: '目的地に到着しました。',
  alermDistance: 1000,
  distance: 0,
  interval: 'auto',
  coords: { latitude: null, longitude: null },
  timeZoneStart: '5:00',
  timeZoneEnd: '12:00',
};
