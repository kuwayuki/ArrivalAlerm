export const distanceMtoKm = meter => {
  var n = 2;
  let km = Math.floor((meter / 1000) * Math.pow(10, n)) / Math.pow(10, n);

  return distanceKeta(km);
};

export const getDistance = (coords1, coords2) => {
  if (coords1 == null || coords2 == null) {
    return '--';
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
    6371 *
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2)
    );
  return distanceKeta(distance) + '\n' + distanceUnit(distance);
};

const distanceKeta = km => {
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

const distanceUnit = km => {
  if (km < 1) {
    return 'm';
  }
  return 'km';
};
