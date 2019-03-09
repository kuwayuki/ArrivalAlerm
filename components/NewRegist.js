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
import { connect } from 'react-redux';
import { getCurrentPosition } from '../containers/position';

let timer = null;

export class NewRegist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [
        {
          title: '通知場所',
          latlng: {
            latitude: props.ownInfo.coords.latitude,
            longitude: props.ownInfo.coords.longitude,
          },
        },
      ],
    };
  }
  markerClick = e => {
    const position = e.nativeEvent.coordinate;
    console.log(position);
    alert('この地点を登録します。');
  };

  timerGetPosition = () => {
    this.interval = setInterval(() => {
      // console.log('aaaa');
      return 'aaa';
    }, 1000);
  };

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
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onPoiClick={e => this.markerSetting(e)}
        initialRegion={{
          latitude: this.props.ownInfo.coords.latitude,
          longitude: this.props.ownInfo.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {this.state.markers.map(marker => (
          <Marker
            key={marker.key}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
            onPress={e => this.markerClick(e)}
          />
        ))}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject, flex: 1 },
});

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(NewRegist);
