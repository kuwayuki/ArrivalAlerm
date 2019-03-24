import { Notifications, Permissions } from 'expo';
import { Platform, PermissionsAndroid } from 'react-native';
import { isCheckDayWeek, isCheckTime } from './position';
import { STATUS } from '../constants/constants';

export const distanceMtoKm = meter => {
  var n = 2;
  let km = Math.floor((meter / 1000) * Math.pow(10, n)) / Math.pow(10, n);

  return distanceKeta(km);
};
export async function initNotification() {
  // 既存のパーミッションを取得
  const { permissions } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
    Permissions.LOCATION
  );
  const currentNotificationPermission = permissions[Permissions.NOTIFICATIONS];
  const currentLocationPermission = permissions[Permissions.LOCATION];
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

  if (currentNotificationPermission.status !== 'granted') {
    // (iOS向け) プッシュ通知の許可をユーザーに求める
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      console.log('notification permission is denied');
      return;
    }
  }
  // プッシュ通知を開いた時のイベントハンドラーを登録
  // Notifications.addListener(this.handleNotification);

  if (currentLocationPermission !== 'granted') {
    // (iOS向け) 位置情報利用の許可をユーザーに求める
    await Permissions.askAsync(Permissions.LOCATION);
  }
}

export const getDistance = (coords1, coords2) => {
  if (coords1 == null || coords2 == null) {
    return '--';
  }

  let distance = getDistanceMeter(coords1, coords2) / 1000;
  return distanceKeta(distance) + '\n' + distanceUnit(distance);
};

export const getStatusIcon = item => {
  // 通知済の場合
  if (!item.isAvailable) {
    return STATUS.DISABLE;
  }
  if (item.isAlermed) {
    return STATUS.ALERMED;
  } else {
    // 曜日指定外の場合
    if (item.isLimitWeekDay && !isCheckDayWeek(item)) {
      return STATUS.OUT_WEEK_DAY;
    }
    // 時間指定外の場合
    if (item.isLimitTimeZone && !isCheckTime(item)) {
      return STATUS.OUT_TIME;
    }

    // 通知設定
    return STATUS.AVAILABLE;
  }
};

export const getDistanceMeter = (coords1, coords2) => {
  if (coords1 == null || coords2 == null) {
    return 999999;
  }
  let lat1 = coords1.latitude;
  let lng1 = coords1.longitude;
  let lat2 = coords2.latitude;
  let lng2 = coords2.longitude;
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  let distance =
    1000 *
    6371 *
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2)
    );
  return distance;
};

export const distanceKeta = km => {
  if (km > 99) {
    km = 99.99;
  } else if (km < 1) {
    // 1kmいないならメートル表示
    km = km * 1000;
    km = km.toFixed(0);
  } else {
    if (String(km).indexOf('.') > 1) {
      km = km.toFixed(1);
    } else {
      km = km.toFixed(2);
    }
  }
  return km;
};

export const distanceUnit = km => {
  if (km < 1) {
    return 'm';
  }
  return 'km';
};
export const getTimeFromDateTime = dateTime => {
  let localeDateTime = dateTime.toLocaleString();
  return localeDateTime.slice(localeDateTime.indexOf(' '), -3);
};
export const getNumTime = time => {
  return Number(
    time.substr(0, time.indexOf(':')) + time.substr(time.indexOf(':') + 1)
  );
};

export const getBgColor = item => {
  return { backgroundColor: getColor(item) };
};

export const getColor = item => {
  let status = getStatusIcon(item);
  let coords2 = item.coords;
  let alermDistance = item.alermDistance;
  switch (status) {
    case STATUS.AVAILABLE:
      return 'deepskyblue';
    case STATUS.DISABLE:
      return 'lightslategray';
    case STATUS.ALERMED:
      return 'forestgreen';
    case STATUS.OUT_WEEK_DAY:
      return 'lightsteelblue';
    case STATUS.OUT_TIME:
      return 'darkorange';
  }
  return 'deepskyblue';
};
