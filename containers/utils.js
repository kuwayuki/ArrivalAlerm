export const distanceMtoKm = meter => {
  var n = 2;
  let km = Math.floor((meter / 1000) * Math.pow(10, n)) / Math.pow(10, n);
  // let keta = String(km).length;
  km = km.toFixed(1);
  if (km > 99) {
    km = 99.9;
  }
  return km;
};

export const getDistance = (lat1, lng1, lat2, lng2) => {
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
  return distanceKeta(distance);
};

const distanceKeta = km => {
  km = km.toFixed(1);
  if (km > 99) {
    km = 99.9;
  }
  return km;
};
