import {
  Platform,
  PermissionsAndroid,
  Vibration,
  PushNotificationIOS,
} from 'react-native';
import { getDistanceMeter } from './utils';
import { Notifications, Permissions, Location, TaskManager } from 'expo';

export async function getCurrentPosition(timeoutMillis = 10000) {
  if (Platform.OS === 'android') {
    const ok = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (!ok) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error();
      }
    }
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: timeoutMillis,
    });
  });
}

// 地点までの距離が、通知距離内かのチェック
export const isInside = (distance, alermDistance) => {
  if (distance < alermDistance) {
    return true;
  }
  return false;
};
// 登録地点が一定距離内に存在するかチェック
export const checkPosition = (ownInfo, alermList) => {
  let isReturn = false;
  // 現在時刻を取得
  let nowTime = null;
  // 現在曜日を取得を取得
  let weekDay = null;

  // 対象が通知範囲内かのチェック
  for (let alermItem of alermList) {
    // 有効の場合のみチェック
    if (alermItem.isAvailable) {
      // console.log('通知チェック！');
      let distance = getDistanceMeter(ownInfo.coords, alermItem.coords);
      let isIn = isInside(distance, alermItem.alermDistance);
      // 未通知チェック
      if (!alermItem.isAlermed) {
        if (!isIn) {
          // 範囲外なら何もしない
          continue;
        }
        // 曜日が有効であるかのチェック
        if (alermItem.isLimitWeekDay) {
          // 曜日指定ありかつ、対象曜日がチェックがついていない
          if (!alermItem.isMonday) {
            continue;
          }
        }
        // 現在時刻が有効であるかのチェック
        if (alermItem.isLimitTimeZone) {
          let timeZoneStart = alermItem.timeZoneStart;
          let timeZoneEnd = alermItem.timeZoneEnd;
          // 時刻指定ありかつ、対象時刻内でない場合
          if (timeZoneStart < timeZoneEnd) {
            // 一般的な時間比較
          } else if (timeZoneStart == timeZoneEnd) {
            // まあ同じ時間はないかな
          } else {
            // 終了日時の方が早いので、0時跨ぎ
          }
        }
        // 対象範囲なので通知を行う
        // console.log('通知!');
        // TODO:alerm
        // TODO:set
        const PATTERN = [1000, 2000, 3000];
        // Vibration.vibrate(PATTERN);

        Notifications.presentLocalNotificationAsync({
          title: 'ネスゴサナイ',
          body: alermItem.alermMessage,
          sound: true,
          data: {
            message: alermItem.alermMessage,
          },
        });
      } else {
        // 通知済の場合は、範囲外なら未通知に変更
        if (!isIn) {
          // TODO:set
          console.log('通知回復');
        }
      }
    }
  }
  return;
};
