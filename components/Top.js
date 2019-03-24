import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Switch,
  Alert,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import * as utils from '../containers/utils';
import * as json from '../containers/jsonFile';
import { _handleNotification, startLocation } from '../containers/location';
import { topHeader } from '../containers/header';
import {
  checkPosition,
  getCurrentPosition,
  isCheckDayWeek,
  isCheckTime,
} from '../containers/position';
import {
  setOwnInfo,
  setOwnInfoCoords,
  setOwnInfoSelectedIndex,
  addAlermItem,
  deleteAlermItem,
  refleshAlermItem,
  setAlermAvailable,
} from '../actions/actions';
import * as DEF from '../constants/constants';
import { LANGUAGE } from '../constants/language';
import { Location, TaskManager, Notifications, Speech } from 'expo';
import TimerMixin from 'react-timer-mixin';

const ICON_SIZE = 20;
const statusicon = item => {
  let status = utils.getStatusIcon(item);
  switch (status) {
    case DEF.STATUS.AVAILABLE:
      return <Icon name="volume-up" size={ICON_SIZE} color="lime" />;
    case DEF.STATUS.DISABLE:
      return <Icon name="volume-off" size={ICON_SIZE} color="red" />;
    case DEF.STATUS.ALERMED:
      return <Icon name="volume-off" size={ICON_SIZE} color="red" />;
    case DEF.STATUS.OUT_WEEK_DAY:
      return (
        <Icon
          name="calendar-times-o"
          type="font-awesome"
          size={ICON_SIZE}
          color="red"
        />
      );
    case DEF.STATUS.OUT_TIME:
      return <Icon name="alarm-off" size={ICON_SIZE} color="red" />;
  }
};

const getRimDistance = (coords1, item) => {
  let status = utils.getStatusIcon(item);
  let coords2 = item.coords;
  let alermDistance = item.alermDistance;
  let disstance = utils.getDistanceMeter(coords1, item.coords);
  let message = '';
  switch (status) {
    case DEF.STATUS.AVAILABLE:
      if (disstance < alermDistance) {
        message = '通知範囲内';
      } else {
        disstance = (disstance - item.alermDistance) / 1000;
        let distanceMe =
          utils.distanceKeta(disstance) + utils.distanceUnit(disstance);
        message = '残り' + distanceMe + 'で通知します';
      }
      return message;
    case DEF.STATUS.DISABLE:
      return '通知オフ';
    case DEF.STATUS.ALERMED:
      return '既に通知済みです';
    case DEF.STATUS.OUT_WEEK_DAY:
      return '本日は通知しません';
    case DEF.STATUS.OUT_TIME:
      return '通知時間外です';
  }
};

export class Top extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    this.interval = setInterval(async () => {
      let ownInfo = await json.getStorageDataOwnInfo();
      this.props.setOwnInfoCoords(ownInfo.coords);
    }, 5000);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.ownInfo.coords != this.props.ownInfo.coords) {
  //     this.setState({ a: aaa++ });
  //     console.log(this.state);
  //     console.log('change');
  //     return true;
  //   } else {
  //     console.log(nextProps.ownInfo.coords);
  //     console.log(this.props.ownInfo.coords);
  //     console.log('none-change');
  //     return false;
  //   }
  // }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  async componentWillMount() {
    try {
      await utils.initNotification();
      // 現在地取得
      const position = await getCurrentPosition(5000);
      this.props.setOwnInfoCoords(position.coords);
      // 設定済情報取得
      await json.getJsonData(this.props);

      Notifications.addListener(_handleNotification);
    } catch (e) {
      // alert(e.message);
    }
  }

  componentDidUpdate() {
    startLocation(this.props.ownInfo, this.props.alermList);
  }

  render() {
    const editRegistBtn = index => {
      this.props.setOwnInfoSelectedIndex(index);
      this.props.navigation.navigate('EditRegist');
    };

    const swipeBtns = index => [
      {
        text: LANGUAGE.wd.del,
        backgroundColor: 'red',
        underlayColor: 'rgba(0,0,0,1)',
        onPress: () => {
          this.props.deleteAlermItem(index);
          json.deleteAsyncStorage(index);
        },
      },
    ];

    return (
      <View style={styles.container}>
        {topHeader(this.props)}
        <FlatList
          data={this.props.alermList}
          extraData={this.props.alermList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Swipeout
              right={swipeBtns(item.index)}
              autoClose={true}
              backgroundColor="transparent">
              <TouchableOpacity
                style={styles.ListRow}
                onPress={() => editRegistBtn(item.index)}>
                <Text style={styles.itemFocus}>
                  {utils.getDistance(this.props.ownInfo.coords, item.coords)}
                </Text>
                <View style={styles.viewMiddle}>
                  <Text style={styles.item} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.icons}>
                    {statusicon(item)}
                    <Text style={styles.itemDis} numberOfLines={1}>
                      {getRimDistance(this.props.ownInfo.coords, item)}
                    </Text>
                  </View>
                </View>
                <Switch
                  style={styles.itemSwitch}
                  onValueChange={value => {
                    json.setPartAsyncStorage(item.index, {
                      isAvailable: value,
                    });
                    this.props.setAlermAvailable(item.index);
                  }}
                  value={item.isAvailable}
                />
              </TouchableOpacity>
            </Swipeout>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'aliceblue',
    flex: 1,
  },
  ListRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 7,
    fontSize: 18,
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    alignItems: 'center',
    // height: 60,
  },
  itemFocus: {
    textAlign: 'center',
    width: 60,
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: 'lightblue',
    color: 'white',
    backgroundColor: 'deepskyblue',
    // backgroundColor: 'turquoise',
    // backgroundColor: 'slateblue',
    // backgroundColor: 'yellowgreen',
    // backgroundColor: 'lightblue',
    // backgroundColor: 'lawngreen',
    // backgroundColor: 'royalblue',
    // backgroundColor: 'lightskyblue',
    // backgroundColor: 'aquamarine',
    // backgroundColor: 'azure',
    // backgroundColor: 'aliceblue',
    // backgroundColor: 'aqua',
    // backgroundColor: 'coral',
    // backgroundColor: 'cornflowerblue',
    // backgroundColor: 'crimson',
    // backgroundColor: 'darkgray',
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
    fontSize: 17,
    // backgroundColor: '#000000',
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  viewMiddle: {
    width: '60%',
  },
  item: {
    paddingTop: 5,
    paddingLeft: 3,
    fontSize: 20,
  },
  itemDis: {
    paddingLeft: 10,
    fontSize: 14,
  },
  itemSwitch: {
    width: 60,
  },
});

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  setOwnInfo,
  setOwnInfoCoords,
  addAlermItem,
  deleteAlermItem,
  refleshAlermItem,
  setAlermAvailable,
  setOwnInfoSelectedIndex,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Top);
