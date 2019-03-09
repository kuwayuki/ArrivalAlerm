import { Platform, PermissionsAndroid } from 'react-native';

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