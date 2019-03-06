import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { UrlTile, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

let timer = null;
let position = null;
async function getCurrentPosition(timeoutMillis = 10000) {
  if (Platform.OS === 'android') {
    const ok = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (!ok) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        // TODO ユーザーにGPS使用許可がもらえなかった場合の処理
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

export default class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirstGet: false,
      timer: 3,
      coords: {
        latitude: 100,
        longitude: 100,
      },
      markers: [
        {
          key: 'setting',
          title: '通知場所',
        },
      ],
    };
  }
  markerClick() {
    alert("この地点を登録します。")
  }

  timerGetPosition = () => {
    this.interval = setInterval(() => {
      // console.log('aaaa');
      return 'aaa';
    }, 1000);
  };

  async componentDidMount() {
    try {
      // this.timerGetPosition();
      const position = await getCurrentPosition(5000);
      const { latitude, longitude } = position.coords;
      const marker_copy = this.state.markers.slice();
      marker_copy[0].latlng = position.coords;
      this.setState({
        isFirstGet: true,
        coords: position.coords,
        markers: marker_copy,
      });
    } catch (e) {
      alert(e.message);
    }
  }
  markerSetting = e => {
    const position = e.nativeEvent.coordinate;
    const marker_copy = this.state.markers.slice();
    marker_copy[0].latlng = position;
    marker_copy[0].title = e.nativeEvent.name;
    this.setState({
      markers: marker_copy,
    });
  };

  render() {
    return (
      this.state.isFirstGet && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          onPoiClick={e => this.markerSetting(e)}
          // onPoiClick={e => console.log(e.nativeEvent)}
          // console.log(e.nativeEvent.coordinate)}
          initialRegion={{
            latitude:
              this.state.coords != null ? this.state.coords.latitude : 100,
            longitude:
              this.state.coords != null ? this.state.coords.longitude : 100,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
          {this.state.markers.map(marker => (
            <Marker
              key={marker.key}
              // coordinate={this.state.coords}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              onPress={() => this.markerClick()}
            />
          ))}
        </MapView>
      )
    );
  }
}

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject, flex: 1 },
});
