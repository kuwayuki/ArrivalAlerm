import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import { addAlermItem } from '../actions/actions';
import { INITIAL_ITEM } from '../constants/constants';
import { Header } from 'react-native-elements';
import * as json from '../containers/jsonFile';
import { LANGUAGE } from '../constants/language';
import { getNumTime, getTimeFromDateTime } from '../containers/utils';

let timer = null;

export class NewRegist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [
        {
          title: LANGUAGE.wd.alermPoint,
          latlng: {
            latitude: props.ownInfo.coords.latitude,
            longitude: props.ownInfo.coords.longitude,
          },
        },
      ],
    };
  }
  // マーカークリック
  async markerClick() {
    let item = {};
    Object.assign(item, INITIAL_ITEM);
    let markers = this.state.markers.slice();
    item.index = await json.getSetIndex();
    item.title = markers[0].title;
    item.coords = markers[0].latlng;
    var date = new Date();
    let nowTime = getTimeFromDateTime(date);
    let numNowTime = getNumTime(nowTime);
    let startTime = 0;
    let endTime = 0;
    if (numNowTime >= 200) {
      startTime = numNowTime - 200;
    } else {
      startTime = 2400 + numNowTime - 200;
    }

    if (numNowTime < 2200) {
      endTime = numNowTime + 200;
    } else {
      endTime = numNowTime + 200 - 2400;
    }
    item.timeZoneStart = String(startTime).substr(0, String(startTime).length - 2) + ':00';
    item.timeZoneEnd = String(endTime).substr(0, String(endTime).length - 2) + ':00';
    this.props.addAlermItem(item);
    json.addAsyncStorage(item);
    this.props.navigation.navigate('Top');
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
      <View style={styles.container}>
        <Header
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => this.props.navigation.navigate('Top'),
          }}
          centerComponent={{ icon: 'map', color: '#fff' }}
          rightComponent={{
            text: LANGUAGE.wd.decision,
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
