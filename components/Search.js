import axios from 'axios';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import {
  setOwnInfoSetting,
  setOwnInfoCoords,
  clearStore,
} from '../actions/actions';
import { PERFORMANCE_KIND } from '../constants/constants';
import { Header, Button, ButtonGroup } from 'react-native-elements';
import { startLocation } from '../containers/location';
import * as json from '../containers/jsonFile';
import { LANGUAGE } from '../constants/language';
import { getCurrentPosition } from '../containers/position';
import { newRegistBtn, searchHeader } from '../containers/header';

const GEOCODE_ENDPOINT =
  'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
// 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=43.041403,141.31998&radius=5000&keyword=ボーリング&key=AIzaSyARtoLl2mHUxeBJfh40wax-k1crkR6ymo0';

// export const getAPI = (coords, word) => {
//   let api =
//     GEOCODE_ENDPOINT +
//     coords.latitude +
//     ',' +
//     coords.longtitude +
//     '&radius=5000' +
//     '&keyword=' +
//     word +
//     '&type=restaurant' +
//     '&key=AIzaSyARtoLl2mHUxeBJfh40wax-k1crkR6ymo0';
// };
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: '',
    };
  }

  handleGetLatAndLng() {
    let option = {
      language: LANGUAGE.wd.locale,
      location:
        this.props.ownInfo.coords.latitude +
        ',' +
        this.props.ownInfo.coords.longitude,
      radius: 50000,
      type: 'transit_station',
      keyword: this.state.word,
      key: 'AIzaSyARtoLl2mHUxeBJfh40wax-k1crkR6ymo0',
    };
    axios
      .get(GEOCODE_ENDPOINT, { params: option })
      .then(results => {
        // 以下のGoogle API のレスポンスの例を元に欲しいデータを取得
        const data = results.data;
        const result = data.results[0];
        console.log(data.results);
        const location = result.geometry.location;
        this.setState({
          address: result.formatted_address,
          lat: location.lat,
          lng: location.lng,
        });

        this.setState({
          alermList: data.results,
        });
      })
      .catch(() => {
        console.log('通信に失敗しました。');
      });
  }

  render() {
    return (
      <View>
        {searchHeader(this.props)}
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.search}</Text>
        <View style={styles.word}>
          <Icon name="search" size="25" containerStyle={styles.wordIcon} />
          <TextInput
            inlineImagePadding={10}
            style={styles.wordInput}
            autoFocus={true}
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
        </View>
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.search}</Text>
        <ScrollView style={styles.searchList}>
          <FlatList
            data={this.state.alermList}
            extraData={this.state.alermList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.ListRow}
                onPress={() => newRegistBtn()}>
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
    );
  }
}

const styles = StyleSheet.create({
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
    width: '60%',
    borderRadius: 5,
    height: 34,
  },
  wordButton: {
    width: 70,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 3,
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    alignItems: 'left',
  },
  searchList: {
    height: 300,
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
});

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
