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
  SETTING: 'SETTING' + unique,
  EDIT_COORDS: 'EDIT_COORDS' + unique,
  EDIT_SETTING: 'EDIT_SETTING' + unique,
  EDIT_SELECTED_INDEX: 'EDIT_SELECTED_INDEX' + unique,
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
  interval: 'auto',
  coords: { latitude: null, longitude: null },
  isLimitTimeZone: false,
  timeZoneStart: '12:00',
  timeZoneEnd: '12:00',
  isLimitWeekDay: false,
  isMonday: true,
  isTuesday: true,
  isWednesday: true,
  isThursday: true,
  isFriday: true,
  isSaturday: true,
  isSunday: true,
};

export const WEEK_DAY = ['月', '火', '水', '木', '金', '土', '日'];
export const DISTANCE_KIND = [
  '100M',
  '300M',
  '500M',
  '1KM',
  '3KM',
  '5KM',
  '10KM',
];

export const PERFORMANCE_KIND = [
  '最低',
  '低',
  '微低',
  '標準',
  '微高',
  '高',
  '最高',
];

export const DISTANCE_KIND_METER = [100, 300, 500, 1000, 3000, 5000, 10000];

export const MAX_TRIAL = 2;
export const MAX_OFFICAL = 8;
