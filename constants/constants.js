import I18n from '../i18n/index';
let unique = '_NAME';

export const DISPLAY_HEADER_ICON = false;

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
  REVIEWED: 'REVIEWED' + unique,
};

export const VIBRATION_PATTERN = {
  PTN_1: [1000, 2000, 3000],
  PTN_2: [1000, 2000, 3000],
  PTN_3: [1000, 2000, 3000],
};

export const DISTANCE_KIND = [
  '100M',
  '300M',
  '500M',
  '1KM',
  '3KM',
  '5KM',
  '10KM',
];

export const DISTANCE_KIND_METER = [100, 300, 500, 1000, 3000, 5000, 10000];

export const MAX_TRIAL = 2;
export const MAX_OFFICAL = 8;
export const RECOVERY_TIME = 60;
export const STATUS = {
  AVAILABLE: 0,
  DISABLE: 1,
  ALERMED: 2,
  OUT_WEEK_DAY: 3,
  OUT_TIME: 4,
};
