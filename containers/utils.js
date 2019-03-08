export const distanceMtoKm = meter => {
  var n = 2;
  let km = Math.floor(meter /1000  * Math.pow(10, n)) / Math.pow(10, n);
  // let keta = String(km).length;
  km = km.toFixed(1);
  if (km > 99) {
    km = 99.9;
  }
  return km;
};
