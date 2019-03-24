import { LANGUAGE } from '../constants/language';
let unique = '_NAME';
export const ALERM_LIST = {
  ADD: 'ADD' + unique,
  EDIT: 'EDIT' + unique,
  DELETE: 'DELETE' + unique,
  REFLESH: 'REFLESH' + unique,
  EDIT_AVAILABLE: 'EDIT_AVAILABLE' + unique,
};
export const CLEAR = 'CLEAR_STATE';

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
  title: LANGUAGE.wd.alermPoint,
  isAvailable: true,
  isAlermed: false,
  alermMessage: LANGUAGE.wd.alermPoint + LANGUAGE.wd.arrivedNear,
  alermDistance: 300,
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

export const WEEK_DAY = [
  LANGUAGE.wd.monday,
  LANGUAGE.wd.tuesday,
  LANGUAGE.wd.wednesday,
  LANGUAGE.wd.thursday,
  LANGUAGE.wd.friday,
  LANGUAGE.wd.saturday,
  LANGUAGE.wd.sunday,
];
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
  LANGUAGE.wd.lowest,
  LANGUAGE.wd.low,
  LANGUAGE.wd.balanced,
  LANGUAGE.wd.high,
  LANGUAGE.wd.highest,
  LANGUAGE.wd.best,
];

export const DISTANCE_KIND_METER = [100, 300, 500, 1000, 3000, 5000, 10000];

export const MAX_TRIAL = 2;
export const MAX_OFFICAL = 8;

export const STATUS = {
  AVAILABLE: 0,
  DISABLE: 1,
  ALERMED: 2,
  OUT_WEEK_DAY: 3,
  OUT_TIME: 4,
};
