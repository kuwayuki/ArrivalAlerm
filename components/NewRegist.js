import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { addAlermItem } from '../actions/actions';
import * as json from '../containers/jsonFile';
import { LANGUAGE } from '../constants/language';
import { newRegistHeader } from '../containers/header';
import axios from 'axios';

const GEOCODE_ENDPOINT =
  'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

let timer = null;

export class NewRegist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: '',
      searchResult: '',
      isSearch: false,
      region: {
        latitude: props.ownInfo.coords.latitude,
        longitude: props.ownInfo.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
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
  initPlace() {
    this.setState({
      word: '',
      isSearch: false,
      region: {
        latitude: this.props.ownInfo.coords.latitude,
        longitude: this.props.ownInfo.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      markers: [
        {
          title: LANGUAGE.wd.alermPoint,
          latlng: {
            latitude: this.props.ownInfo.coords.latitude,
            longitude: this.props.ownInfo.coords.longitude,
          },
        },
      ],
    });
  }
  handleGetLatAndLng() {
    if (this.state.word.length == 0) {
      this.setState({
        isSearch: false,
      });
      return;
    }
    let option = {
      language: LANGUAGE.wd.locale,
      location:
        this.props.ownInfo.coords.latitude +
        ',' +
        this.props.ownInfo.coords.longitude,
      radius: 50000,
      type: 'transit_station',
      name: this.state.word,
      keyword: this.state.word,
      key: 'AIzaSyARtoLl2mHUxeBJfh40wax-k1crkR6ymo0',
    };
    axios
      .get(GEOCODE_ENDPOINT, { params: option })
      .then(results => {
        // 以下のGoogle API のレスポンスの例を元に欲しいデータを取得
        const data = results.data;
        const result = data.results[0];
        const location = result.geometry.location;

        if (data.results != null || data.results.length > 0) {
          this.setState({
            isSearch: true,
            searchResult:
              data.results.length + LANGUAGE.wd.searchSuccessMessage,
            alermList: data.results,
          });
          // キーボード非表示
          Keyboard.dismiss();
        } else {
          alert(LANGUAGE.wd.searchErrorMessage);
          this.setState({
            isSearch: false,
          });
        }
      })
      .catch(() => {
        alert(LANGUAGE.wd.searchErrorMessage);
        this.setState({
          isSearch: false,
        });
      });
  }

  listSelect = item => {
    let coords = {
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    };
    this.markerSetting(coords, item.name);
    this.regionSetting(coords);
  };

  regionSetting = position => {
    let region = this.state.region;
    region.latitude = position.latitude;
    region.longitude = position.longitude;
    this.setState({
      region,
    });
  };
  markerSetting = (position, name) => {
    const marker_copy = this.state.markers.slice();
    marker_copy[0].latlng = position;
    marker_copy[0].title = name;
    this.setState({
      markers: marker_copy,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {newRegistHeader(this.state, this.props)}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.word}>
            <Icon name="search" size="25" containerStyle={styles.wordIcon} />
            <TextInput
              inlineImagePadding={10}
              style={styles.wordInput}
              autoFocus={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={word => this.setState({ word })}
              value={this.state.word}
              onSubmitEditing={() => this.handleGetLatAndLng()}
            />
            <Button
              style={styles.wordButton}
              title={LANGUAGE.wd.search}
              onPress={() => this.handleGetLatAndLng()}
            />
            <Button
              style={styles.wordButton}
              buttonStyle={styles.bgColorRed}
              title={LANGUAGE.wd.searchInit}
              onPress={() => this.initPlace()}
            />
          </View>
        </TouchableWithoutFeedback>
        {this.state.isSearch && (
          <View style={styles.searchListView}>
            <Text style={styles.sectionHeader}>
              {LANGUAGE.wd.searchResult + this.state.searchResult}
            </Text>
            <ScrollView>
              <FlatList
                data={this.state.alermList}
                extraData={this.state.alermList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.ListRow}
                    onPress={() => this.listSelect(item)}>
                    <Icon
                      name="map-pin"
                      type="font-awesome"
                      color="red"
                      size="25"
                      containerStyle={styles.icon}
                    />
                    <View style={styles.item}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemDis} numberOfLines={1}>
                        {item.vicinity}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
        )}
        <MapView
          provider={PROVIDER_GOOGLE}
          style={!this.state.isSearch ? styles.map : styles.mapShort}
          onPoiClick={e => {
            this.regionSetting(e.nativeEvent.coordinate);
            this.markerSetting(e.nativeEvent.coordinate, e.nativeEvent.name);
          }}
          onRegionChangeComplete={region => this.setState({ region })}
          region={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta,
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
  map: {
    flex: 1,
  },
  mapShort: {
    flex: 1,
  },
  searchListView: {
    maxHeight: 181,
  },
  word: {
    padding: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // justifyContent: 'center',
    backgroundColor: 'white',
  },
  wordIcon: {
    backgroundColor: 'white',
    padding: 5,
  },
  wordInput: {
    marginLeft: 20,
    borderWidth: 1,
    fontSize: 18,
    width: '50%',
    borderRadius: 5,
    height: 34,
  },
  wordButton: {
    width: 60,
    height: 34,
    paddingLeft: 10,
  },
  sectionHeader: {
    color: 'white',
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'turquoise',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
  },
  ListRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 3,
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    alignItems: 'left',
  },
  icon: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
  },
  item: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  itemTitle: {
    fontSize: 18,
  },
  itemDis: {
    paddingTop: 3,
    fontSize: 12,
  },
  bgColorRed: {
    backgroundColor: 'red',
  },
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
