import * as React from 'react';
import {
  Text,
  Switch,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  SectionList,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import { setAlermItem } from '../actions/actions';
import {
  INITIAL_ITEM,
  DISTANCE_KIND,
  DISTANCE_KIND_METER,
  WEEK_DAY,
} from '../constants/constants';
import {
  Header,
  CheckBox,
  Button,
  ButtonGroup,
} from 'react-native-elements';
import * as json from '../containers/jsonFile';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as utils from '../containers/utils';
let listIndex = 0;
let selectTimer = 0; // 0:start / 1:end

const getListIndex = props => {
  let index = 0;
  for (let alermItem of props.alermList) {
    if (alermItem.index === props.ownInfo.selectedIndex) {
      return index;
    }
    index++;
  }
};

const getSelectedDistanceIndex = alermDistance => {
  let index = 0;
  for (let meter of DISTANCE_KIND_METER) {
    if (meter == alermDistance) {
      return index;
    }
    index++;
  }
  return 9;
};

export class EditRegist extends React.Component {
  constructor(props) {
    super(props);
    listIndex = getListIndex(props);
    let selectIndex = getSelectedDistanceIndex(
      props.alermList[listIndex].alermDistance
    );
    this.state = {
      isSelectedDistance: selectIndex != 9,
      selectedDistanceIndex: selectIndex,
      title: props.alermList[listIndex].title,
      isAvailable: props.alermList[listIndex].isAvailable,
      isAlermed: props.alermList[listIndex].isAlermed,
      alermMessage: props.alermList[listIndex].alermMessage,
      alermDistance: String(props.alermList[listIndex].alermDistance),
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
    item.isAlermed = false;
    item.alermDistance = Number(this.state.alermDistance);
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

  //
  selectedDistanceClick = selectedDistanceIndex => {
    this.setState({ selectedDistanceIndex });
    let selectMeter = 1000;
    switch (selectedDistanceIndex) {
      case 0:
        selectMeter = DISTANCE_KIND_METER[0];
        break;
      case 1:
        selectMeter = DISTANCE_KIND_METER[1];
        break;
      case 2:
        selectMeter = DISTANCE_KIND_METER[2];
        break;
      case 3:
        selectMeter = DISTANCE_KIND_METER[3];
        break;
      case 4:
        selectMeter = DISTANCE_KIND_METER[4];
        break;
      case 5:
        selectMeter = DISTANCE_KIND_METER[5];
        break;
      case 6:
        selectMeter = DISTANCE_KIND_METER[6];
        break;
    }
    this.setState({ alermDistance: String(selectMeter) });
  };

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

  _showDateTimePicker = target => {
    selectTimer = target;
    this.setState({ isDateTimePickerVisible: true });
  };

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = time => {
    if (selectTimer == 0) {
      this.setState({ timeZoneStart: utils.getTimeFromDateTime(time) });
    } else {
      this.setState({ timeZoneEnd: utils.getTimeFromDateTime(time) });
    }
    this._hideDateTimePicker();
  };

  render() {
    const checkBoxContainer = (index, stateWeekDay) => {
      return (
        <CheckBox
          containerStyle={styles.checkBox}
          textStyle={styles.checkBox}
          title={WEEK_DAY[index]}
          checked={stateWeekDay}
          onPress={() => {
            switch (index) {
              case 0:
                return this.setState({ isMonday: !stateWeekDay });
              case 1:
                return this.setState({ isTuesday: !stateWeekDay });
              case 2:
                return this.setState({ isWednesday: !stateWeekDay });
              case 3:
                return this.setState({ isThursday: !stateWeekDay });
              case 4:
                return this.setState({ isFriday: !stateWeekDay });
              case 5:
                return this.setState({ isSaturday: !stateWeekDay });
              case 6:
                return this.setState({ isSunday: !stateWeekDay });
            }
          }}
          iconRight
        />
      );
    };
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
          <Text style={styles.sectionHeader}>通知距離</Text>
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>
              {this.state.isSelectedDistance ? '選択入力' : '手動入力'}
            </Text>
            <Switch
              style={styles.setting}
              onValueChange={isSelectedDistance =>
                this.setState({ isSelectedDistance })
              }
              value={this.state.isSelectedDistance}
            />
          </View>
          {this.state.isSelectedDistance ? (
            <View style={styles.bgColorWhite}>
              <ButtonGroup
                onPress={this.selectedDistanceClick}
                selectedButtonStyle={styles.bgColorSelected}
                buttons={DISTANCE_KIND}
                selectedIndex={this.state.selectedDistanceIndex}
              />
            </View>
          ) : (
            <View style={styles.rowTextSetting}>
              <TextInput
                style={styles.textNum}
                keyboardType={'number-pad'}
                onChangeText={alermDistance => this.setState({ alermDistance })}
                value={this.state.alermDistance}
              />
              <Text>メートル</Text>
            </View>
          )}
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
              {checkBoxContainer(0, this.state.isMonday)}
              {checkBoxContainer(1, this.state.isTuesday)}
              {checkBoxContainer(2, this.state.isWednesday)}
              {checkBoxContainer(3, this.state.isThursday)}
              {checkBoxContainer(4, this.state.isFriday)}
              {checkBoxContainer(5, this.state.isSaturday)}
              {checkBoxContainer(6, this.state.isSunday)}
            </View>
          )}
          <DateTimePicker
            mode={'time'}
            date={
              selectTimer == 0
                ? new Date('2019/03/10 ' + this.state.timeZoneStart)
                : new Date('2019/03/10 ' + this.state.timeZoneEnd)
            }
            titleIOS={
              selectTimer == 0 ? '通知時間帯：開始' : '通知時間帯：終了'
            }
            confirmTextIOS={'OK'}
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
                onPress={() => this._showDateTimePicker(0)}>
                {this.state.timeZoneStart}
              </Text>
              <Text>～</Text>
              <Text
                style={styles.timeZone}
                onPress={() => this._showDateTimePicker(1)}>
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
    height: 220,
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
    // textAlign: 'right',
  },
  bgColorWhite: {
    backgroundColor: 'white',
  },
  bgColorSelected: {
    backgroundColor: 'cornflowerblue',
  },
  textNum: {
    width: '80%',
    padding: 9,
    paddingLeft: 30,
    fontSize: 18,
    textAlign: 'right',
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
