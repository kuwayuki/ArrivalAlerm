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
      coords: {
        latitude: 100,
        longitude: 100,
      },
      markers: [
        {
          key: 'tamachiStation',
          latlng: {
            latitude: 35.645736,
            longitude: 139.747575,
          },
          title: '田町駅',
          description: '田町ニューデイズ',
        },
      ],
    };
  }
  markerClick() {
    console.log('Marker was clicked');
  }
  async componentDidMount() {
    try {
      const position = await getCurrentPosition(5000);
      const { latitude, longitude } = position.coords;
      this.setState({
        isFirstGet: true,
        coords: {
          latitude,
          longitude,
        },
        latlng: {
          latitude,
          longitude,
        },
      });
    } catch (e) {
      alert(e.message);
    }
  }
  render() {
    return (
      this.state.isFirstGet && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
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
              coordinate={this.state.coords}
              // coordinate={marker.latlng}
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
