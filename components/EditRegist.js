import * as React from 'react';
import {
  Text,
  Switch,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
  SectionList,
  Picker,
} from 'react-native';
import MapView, { UrlTile, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import { getCurrentPosition } from '../containers/position';
import { setAlermItem } from '../actions/actions';
import { INITIAL_ITEM, DISTANCE_KIND, WEEK_DAY } from '../constants/constants';
import {
  Header,
  Input,
  CheckBox,
  Icon,
  Button,
  ButtonGroup,
} from 'react-native-elements';
import * as json from '../containers/jsonFile';
import { Dropdown } from 'react-native-material-dropdown';
import DateTimePicker from 'react-native-modal-datetime-picker';
let listIndex = 0;

const getListIndex = props => {
  let index = 0;
  for (let alermItem of props.alermList) {
    if (alermItem.index === props.ownInfo.selectedIndex) {
      return index;
    }
    index++;
  }
};
export class EditRegist extends React.Component {
  constructor(props) {
    super(props);
    listIndex = getListIndex(props);
    this.state = {
      title: props.alermList[listIndex].title,
      isAvailable: props.alermList[listIndex].isAvailable,
      isAlermed: props.alermList[listIndex].isAlermed,
      alermMessage: props.alermList[listIndex].alermMessage,
      alermDistance: props.alermList[listIndex].alermDistance,
      interval: props.alermList[listIndex].interval,
      isLimitTimeZone: props.alermList[listIndex].isLimitTimeZone,
      timeZoneStart: props.alermList[listIndex].timeZoneStart,
      timeZoneEnd: props.alermList[listIndex].timeZoneEnd,
      isLimitWeekDay: props.alermList[listIndex].isLimitWeekDay,
      isMonday: props.alermList[listIndex].isMonday,
      isTuesday: props.alermList[listIndex].isTuesday,
      isWednesday: props.alermList[listIndex].isWednesday,
      isThursday: props.alermList[listIndex].isThursday,
      isFriday: props.alermList[listIndex].isFriday,
      isSaturday: props.alermList[listIndex].isSaturday,
      isSunday: props.alermList[listIndex].isSunday,
      coords: {
        latitude: props.alermList[listIndex].coords.latitude,
        longitude: props.alermList[listIndex].coords.longitude,
      },
      // editAlerm: props.alermList[listIndex],
      markers: [
        {
          title: props.alermList[listIndex].title,
          latlng: {
            latitude: props.alermList[listIndex].coords.latitude,
            longitude: props.alermList[listIndex].coords.longitude,
          },
        },
      ],
    };
  }
  // マーカークリック
  async markerClick() {
    let item = {};
    Object.assign(item, this.props.alermList[listIndex]);
    let markers = this.state.markers.slice();
    item.title = this.state.title;
    item.alermMessage = this.state.alermMessage;
    item.alermDistance = this.state.alermDistance;
    item.coords = this.state.coords;
    item.isLimitTimeZone = this.state.isLimitTimeZone;
    item.timeZoneStart = this.state.timeZoneStart;
    item.timeZoneEnd = this.state.timeZoneEnd;
    item.isLimitWeekDay = this.state.isLimitWeekDay;
    item.isMonday = this.state.isMonday;
    item.isTuesday = this.state.isTuesday;
    item.isWednesday = this.state.isWednesday;
    item.isThursday = this.state.isThursday;
    item.isFriday = this.state.isFriday;
    item.isSaturday = this.state.isSaturday;
    item.isSunday = this.state.isSunday;
    item.coords = markers[0].latlng;
    this.props.setAlermItem(item);
    json.addAsyncStorage(item);
    this.props.navigation.navigate('Top');
  }

  markerSetting = e => {
    const position = e.nativeEvent.coordinate;
    const marker_copy = this.state.markers.slice();
    marker_copy[0].latlng = position;
    marker_copy[0].title = e.nativeEvent.name;
    this.setState({
      title: e.nativeEvent.name,
      markers: marker_copy,
    });
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = time => {
    console.log('A date has been picked: ', new Date());
    // console.log('A date has been picked: ', time.toLocaleString());
    this._hideDateTimePicker();
  };

  render() {
    const buttons = ['100M', '300M', '500M', '1KM', '3KM', '5KM'];
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{
            text: '戻る',
            style: { color: '#fff' },
            onPress: () => this.props.navigation.navigate('Top'),
          }}
          centerComponent={{ text: '編集', style: { color: '#fff' } }}
          rightComponent={{
            text: '決定',
            style: { color: '#fff' },
            onPress: () => this.markerClick(),
          }}
        />
        <ScrollView>
          <SectionList
            sections={[
              {
                title: 'タイトル',
                data: [this.state.title],
              },
            ]}
            renderItem={({ item }) => (
              <TextInput
                style={styles.item}
                onChangeText={title => this.setState({ title })}
                value={item}
              />
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
          />
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            onPoiClick={e => this.markerSetting(e)}
            initialRegion={{
              latitude: this.state.coords.latitude,
              longitude: this.state.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
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
          <ButtonGroup onPress={this.updateIndex} buttons={buttons} />
          <SectionList
            sections={[
              {
                title: '通知距離',
                data: [this.state.alermDistance],
              },
            ]}
            renderItem={({ item }) => (
              <Dropdown
                data={DISTANCE_KIND}
                value={item}
                containerStyle={styles.itemDrompDown}
                onChangeText={alermDistance => this.setState({ alermDistance })}
              />
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
          />
          <Text style={styles.sectionHeader}>通知曜日</Text>
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>曜日を指定</Text>
            <Switch
              style={styles.setting}
              onValueChange={isLimitWeekDay =>
                this.setState({ isLimitWeekDay })
              }
              value={this.state.isLimitWeekDay}
            />
          </View>
          {this.state.isLimitWeekDay && (
            <View style={styles.rowStyle}>
              <CheckBox
                containerStyle={styles.checkBox}
                textStyle={styles.checkBox}
                title={WEEK_DAY[0]}
                checked={this.state.isMonday}
                onPress={() =>
                  this.setState({ isMonday: !this.state.isMonday })
                }
                iconRight
              />
              <CheckBox
                containerStyle={styles.checkBox}
                textStyle={styles.checkBox}
                title={WEEK_DAY[1]}
                checked={this.state.isTuesday}
                onPress={() =>
                  this.setState({ isTuesday: !this.state.isTuesday })
                }
                iconRight
              />
              <CheckBox
                containerStyle={styles.checkBox}
                textStyle={styles.checkBox}
                title={WEEK_DAY[2]}
                checked={this.state.isWednesday}
                onPress={() =>
                  this.setState({ isWednesday: !this.state.isWednesday })
                }
                iconRight
              />
              <CheckBox
                containerStyle={styles.checkBox}
                textStyle={styles.checkBox}
                title={WEEK_DAY[3]}
                checked={this.state.isThursday}
                onPress={() =>
                  this.setState({ isThursday: !this.state.isThursday })
                }
                iconRight
              />
              <CheckBox
                containerStyle={styles.checkBox}
                textStyle={styles.checkBox}
                title={WEEK_DAY[4]}
                checked={this.state.isFriday}
                onPress={() =>
                  this.setState({ isFriday: !this.state.isFriday })
                }
                iconRight
              />
              <CheckBox
                containerStyle={styles.checkBox}
                textStyle={styles.checkBox}
                title={WEEK_DAY[5]}
                checked={this.state.isSaturday}
                onPress={() =>
                  this.setState({ isSaturday: !this.state.isSaturday })
                }
                iconRight
              />
              <CheckBox
                containerStyle={styles.checkBox}
                textStyle={styles.checkBox}
                title={WEEK_DAY[6]}
                checked={this.state.isSunday}
                onPress={() =>
                  this.setState({ isSunday: !this.state.isSunday })
                }
                iconRight
              />
            </View>
          )}
          <DateTimePicker
            mode={'time'}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />
          <Text style={styles.sectionHeader}>通知時間帯</Text>
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>時間を指定</Text>
            <Switch
              style={styles.setting}
              onValueChange={isLimitTimeZone =>
                this.setState({ isLimitTimeZone })
              }
              value={this.state.isLimitTimeZone}
            />
          </View>
          {this.state.isLimitTimeZone && (
            <View style={styles.rowStyle}>
              <Text
                style={styles.timeZone}
                onPress={() => this._showDateTimePicker()}>
                {this.state.timeZoneStart}
              </Text>
              <Text>～</Text>
              <Text
                style={styles.timeZone}
                onPress={() => this._showDateTimePicker()}>
                {this.state.timeZoneEnd}
              </Text>
            </View>
          )}
          <Button title="更新" onPress={() => this.markerClick()} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'aliceblue',
    flex: 1,
  },
  map: {
    // flex: 1
    height: 300,
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
    // backgroundColor: 'lightblue',
    // backgroundColor: 'deepskyblue',
    // backgroundColor: 'slateblue',
    // backgroundColor: 'yellowgreen',
    // backgroundColor: 'lightskyblue',
    // backgroundColor: 'aquamarine',
    // backgroundColor: 'azure',
    // backgroundColor: 'aliceblue',
    // backgroundColor: 'aqua',
    // backgroundColor: 'coral',
    // backgroundColor: 'cornflowerblue',
    // backgroundColor: 'crimson',
    // backgroundColor: 'darkgray',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
  },
  item: {
    padding: 10,
    margin: 0,
    paddingLeft: 50,
    fontSize: 18,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    // textAlign: 'right',
  },
  itemDrompDown: {
    margin: 0,
    paddingLeft: 250,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    // textAlign: 'right',
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  rowTextSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    width: '80%',
    paddingLeft: 30,
    fontSize: 18,
  },
  setting: {
    paddingLeft: 150,
  },
  checkBox: {
    padding: 0,
    margin: 0,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0,
    textAlign: 'right',
  },
  timeZone: {
    width: '40%',
    paddingLeft: 50,
    fontSize: 18,
  },
});

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  setAlermItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRegist);
