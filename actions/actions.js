import * as DEF from '../constants/constants';

// ★自分情報★ //////////////////////
// 現在地地点情報：設定
export const setOwnInfoCoords = coords => ({
  type: DEF.OWN_INFO.EDIT_COORDS,
  coords: coords,
});
// 現在地地点情報取得間隔：設定
export const setOwnInfoInterval = interval => ({
  type: DEF.OWN_INFO.EDIT_COORDS,
  interval: interval,
});

// ★アラームリスト★ //////////////////////
// アラーム項目：追加
export const addAlermItem = alermItem => ({
  type: DEF.ALERM_LIST.ADD,
  alermItem: alermItem,
});
// アラーム項目：編集
export const setAlermItem = (index, alermItem) => ({
  type: DEF.ALERM_LIST.EDIT,
  index: index,
  alermItem: alermItem,
});
// アラーム項目：削除
export const deleteAlermItem = index => ({
  type: DEF.ALERM_LIST.DELETE,
  index: index,
});
// 有効／無効切替
export const setAlermAvailable = index => ({
  type: DEF.ALERM_LIST.EDIT_AVAILABLE,
  index: index,
});
