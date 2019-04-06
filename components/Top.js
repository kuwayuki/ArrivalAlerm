import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Switch,
  Alert,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../containers/styles';
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
        message = LANGUAGE.wd.distanceInside;
      } else {
        disstance = (disstance - item.alermDistance) / 1000;
        let distanceMe =
          utils.distanceKeta(disstance) + utils.distanceUnit(disstance);
        message =
          LANGUAGE.wd.distanceMessage1 +
          distanceMe +
          LANGUAGE.wd.distanceMessage2;
      }
      return message;
    case DEF.STATUS.DISABLE:
      return LANGUAGE.wd.distanceMessageNone;
    case DEF.STATUS.ALERMED:
      return LANGUAGE.wd.distanceMessageAlermed;
    case DEF.STATUS.OUT_WEEK_DAY:
      return LANGUAGE.wd.distanceMessageOutsideWeekDay;
    case DEF.STATUS.OUT_TIME:
      return LANGUAGE.wd.distanceMessageOutsideTime;
  }
};

export class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
    };
  }
  onRefresh() {
    this.setState({ isFetching: true }, async function() {
      const position = await getCurrentPosition(5000);
      this.props.setOwnInfoCoords(position.coords);
      this.setState({ isFetching: false });
    });
  }
  async componentDidMount() {
    if (this.timer == null) {
      this.timer = setInterval(async () => {
        let ownInfo = await json.getStorageDataOwnInfo();
        this.props.setOwnInfoCoords(ownInfo.coords);
        this.setState({ isFetching: false });
      }, 5000);
    }
  }

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

    const sortList = () => {
      return this.props.alermList.sort((a, b) => {
        let sortA;
        let sortB;
        switch (this.props.ownInfo.sortKind) {
          case 0:
            sortA = a.index;
            sortB = b.index;
            break;
          case 1:
            sortA = utils.getDistanceMeter(this.props.ownInfo.coords, a.coords);
            sortB = utils.getDistanceMeter(this.props.ownInfo.coords, b.coords);
            break;
        }
        if (this.props.ownInfo.sortType) {
          return sortA - sortB;
        }
        return sortB - sortA;
      });
    };

    return (
      <View style={styles.container}>
        {topHeader(this.props)}
        <FlatList
          data={sortList()}
          extraData={this.props.alermList}
          keyExtractor={item => item.id}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          renderItem={({ item }) => (
            <Swipeout
              right={swipeBtns(item.index)}
              autoClose={true}
              backgroundColor="transparent">
              <TouchableOpacity
                style={styles.itemListRow}
                onPress={() => editRegistBtn(item.index)}>
                <Text style={[styles.itemFocus, utils.getBgColor(item)]}>
                  {utils.getDistance(this.props.ownInfo.coords, item.coords)}
                </Text>
                <View style={styles.viewMiddle}>
                  <Text style={styles.itemList} numberOfLines={1}>
                    {item.title.replace(/\s+/g, '')}
                  </Text>
                  <View style={styles.icons}>
                    {statusicon(item)}
                    <Text style={styles.itemListDis} numberOfLines={1}>
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
