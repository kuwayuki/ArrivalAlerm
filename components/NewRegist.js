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
import { addAlermItem } from '../actions/actions';
import { INITIAL_ITEM } from '../constants/constants';
import { Header } from 'react-native-elements';

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
  // マーカークリック
  markerClick = () => {
    let item = {};
    Object.assign(item, INITIAL_ITEM);
    let markers = this.state.markers.slice();
    item.index = this.props.alermList.length;
    item.title = markers[0].title;
    item.coords = markers[0].latlng;
    this.props.addAlermItem(item);
    this.props.navigation.navigate('Top');
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
      <View style={styles.container}>
        <Header
          leftComponent={{
            text: '戻る',
            style: { color: '#fff' },
            onPress: () => this.props.navigation.navigate('Top'),
          }}
          centerComponent={{ text: '新規登録', style: { color: '#fff' } }}
          rightComponent={{
            text: '決定',
            style: { color: '#fff' },
            onPress: () => this.markerClick(),
          }}
        />
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
              onPress={() => this.markerClick()}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: { flex: 1 },
});

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  addAlermItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewRegist);
