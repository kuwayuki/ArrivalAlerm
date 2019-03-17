import {
  Location,
  TaskManager,
  Notifications,
  Speech,
  Permissions,
} from 'expo';
import {
  mergeStorageDataOwnInfo,
  getStorageDataOwnInfo,
  getAllStorageDataAlermList,
} from '../containers/jsonFile';
import { checkPosition, getCurrentPosition } from '../containers/position';
import { Vibration } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';

let isChecking = false;
let alermList = null;
export async function _handleNotification(notification) {
  if (notification.origin === 'selected') {
    //バックグラウンドで通知
    // Vibration.vibrate(1, true);
    // Speech.speak(notification.data.message, { 'language ': 'ja' });
  } else if (notification.origin === 'received') {
    if (isChecking) {
      //フォアグラウンドで通知
      const PATTERN = [1000, 2000, 3000];
      Vibration.vibrate(PATTERN);
      Speech.speak(notification.data.message, { 'language ': 'ja' });
    }
  } else if (notification.origin !== 'granted') {
    // (iOS向け) 位置情報利用の許可をユーザーに求める
    await Permissions.askAsync(Permissions.LOCATION);
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (isChecking) return;
  isChecking = true;
  if (data) {
    const { locations } = data;
    await mergeStorageDataOwnInfo(locations[0]);
    // AsyncStorageより情報取得
    alermList = await getAllStorageDataAlermList();
    let ownInfo = await getStorageDataOwnInfo();
    await checkPosition(ownInfo, alermList);
  }
  isChecking = false;
});

const getBestPerformance = alermList => {
  let accuracy = Location.Accuracy.Lowest;
  let alermDistance = 10000;
  for (let alermItem of alermList) {
    // 有効の場合のみチェック
    if (alermItem.isAvailable) {
      // 通知距離を取得
      let localDis = alermItem.alermDistance;
      // 最小値を取得
      if (alermDistance > localDis) {
        alermDistance = localDis;
      }
    }
  }
  if (alermDistance <= 5) {
    accuracy = Location.Accuracy.Highest;
  } else if (alermDistance <= 10) {
    accuracy = Location.Accuracy.High;
  } else if (alermDistance <= 100) {
    accuracy = Location.Accuracy.Balanced;
  } else if (alermDistance <= 1000) {
    accuracy = Location.Accuracy.Low;
  } else if (alermDistance <= 3000) {
    accuracy = Location.Accuracy.Lowest;
  }
  return { accuracy: accuracy, distance: alermDistance };
};

let beforeSetting = null;
export const startLocation = (ownInfo, alermList) => {
  let accuracy = Location.Accuracy.Balanced;
  let distanceInterval = 10;
  if (ownInfo != null) {
    if (ownInfo.performance == 0) {
      if (alermList != null) {
        // 自動取得設定
        let retPer = getBestPerformance(alermList);
        accuracy = retPer.accuracy;
        distanceInterval = retPer.distance;
      }
    } else {
      accuracy = ownInfo.performance;
      distanceInterval = ownInfo.distance;
    }
  }
  let nextSetting = { accuracy: accuracy, distance: distanceInterval };
  if (
    beforeSetting == null ||
    (beforeSetting.accuracy != nextSetting.accuracy ||
      beforeSetting.distance != nextSetting.distance)
  ) {
    beforeSetting = nextSetting;
    TaskManager.unregisterAllTasksAsync();
    Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: accuracy,
      distanceInterval: distanceInterval,
    });
  }
};
