import { AsyncStorage } from 'react-native';
let json = require('../assets/setting.json');
const UNIQUE_INDEX = 'INDEX';
const UNIQUE_SETTING = 'SETTING';
const UNIQUE_ALERM = 'ALERM';

export async function getSetIndex() {
  let strIndex = await AsyncStorage.getItem(UNIQUE_INDEX);
  let index = 0;
  if (strIndex !== null) {
    index = Number(strIndex);
  }
  await AsyncStorage.setItem(UNIQUE_INDEX, String(index + 1));
  return index;
}

export async function isExistsAsyncStorage(props) {
  const value = await AsyncStorage.getItem(UNIQUE_SETTING);
  if (value !== null) {
    props.setOwnInfo(JSON.parse(value));
    return true;
  }
  return false;
}
export async function addAsyncStorage(alermItem) {
  AsyncStorage.setItem(
    UNIQUE_ALERM + alermItem.index,
    JSON.stringify(alermItem)
  );
}
export async function deleteAsyncStorage(index) {
  AsyncStorage.removeItem(UNIQUE_ALERM + index);
}
export async function clearAsyncStorage(index) {
  AsyncStorage.clear();
}

// jsonファイルから通知情報を取得
export async function getJsonData(props) {
  if (isExistsAsyncStorage(props)) {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let value = store[i][1];
          if (key.indexOf(UNIQUE_ALERM) != -1) {
            props.addAlermItem(JSON.parse(value));
          }
        });
      });
    });
  } else {
    console.log('jsonファイルから読み込み');
    AsyncStorage.clear();
    json.filter(function(item, index) {
      // 通知項目情報取得
      if (item.isFree != null) {
        AsyncStorage.setItem(UNIQUE_SETTING, JSON.stringify(item));
      }
    });
  }
}
// jsonファイルに通知情報を追加
export async function addJsonData(alermItem) {
  json.push(alermItem);
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys, (err, stores) => {
      stores.map((result, i, store) => {
        // get at each store's key/value so you can work with it
        let key = store[i][0];
        let value = store[i][1];
        // AsyncStorage.removeItem(key);
      });
    });
  });
}

// jsonファイルから通知情報を削除
export async function deleteJsonData(index) {
  var newData = json.filter(function(item, index) {
    if (item.index != index) return true;
  });
  json = newData;
}