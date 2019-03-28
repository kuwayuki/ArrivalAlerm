import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import { addAlermItem } from '../actions/actions';
import { Header } from 'react-native-elements';
import * as json from '../containers/jsonFile';
import { LANGUAGE } from '../constants/language';
import { newRegistHeader } from '../containers/header';
import axios from 'axios';

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
        {newRegistHeader(this.state, this.props)}
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
