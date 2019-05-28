import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Notifications } from 'expo';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import axios from 'axios';
import { styles } from '../containers/styles';
import * as utils from '../containers/utils';
import * as json from '../containers/jsonFile';
import { startLocation, clearBefore } from '../containers/location';
import { topHeader } from '../containers/header';
import { admobBanner } from '../containers/googleAdmob';
import { getCurrentPosition } from '../containers/position';
import {
  setOwnInfo,
  setOwnInfoCoords,
  setOwnInfoSelectedIndex,
  setOwnInfoReviewed,
  addAlermItem,
  deleteAlermItem,
  refleshAlermItem,
  setAlermAvailable,
} from '../actions/actions';
import * as DEF from '../constants/constants';
import I18n from '../i18n/index';

let before = null;
let nearest = false;
const ICON_SIZE = 20;
const GEOCODE_ENDPOINT = 'http://map.simpleapi.net/stationapi';

const statusicon = item => {
  let status = utils.getStatusIcon(item);
  switch (status) {
    case DEF.STATUS.AVAILABLE:
      return <MaterialIcons name="volume-up" size={ICON_SIZE} color="lime" />;
    case DEF.STATUS.DISABLE:
      return <MaterialIcons name="volume-off" size={ICON_SIZE} color="red" />;
    case DEF.STATUS.ALERMED:
      return <MaterialIcons name="volume-off" size={ICON_SIZE} color="red" />;
    case DEF.STATUS.OUT_WEEK_DAY:
      return (
        <FontAwesome name="calendar-times-o" size={ICON_SIZE} color="red" />
      );
    case DEF.STATUS.OUT_TIME:
      return <MaterialIcons name="alarm-off" size={ICON_SIZE} color="red" />;
  }
};

const exceptStationLine = line => {
  let pos = line.indexOf('（');
  if (pos > 0) {
    line = line.substring(0, pos);
  }
  pos = line.indexOf(' (');
  if (pos > 0) {
    line = line.substring(0, pos);
  }
  pos = line.indexOf('(');
  if (pos > 0) {
    line = line.substring(0, pos);
  }
  pos = line.indexOf('ほか');
  if (pos > 0) {
    line = line.substring(0, pos);
  }
  return line + ' ';
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
        message = I18n.t('distanceInside');
      } else {
        disstance = (disstance - item.alermDistance) / 1000;
        let distanceMe =
          utils.distanceKeta(disstance) + utils.distanceUnit(disstance);
        message =
          I18n.t('distanceMessage1') + distanceMe + I18n.t('distanceMessage2');
      }
      return message;
    case DEF.STATUS.DISABLE:
      return I18n.t('distanceMessageNone');
    case DEF.STATUS.ALERMED:
      return I18n.t('distanceMessageAlermed');
    case DEF.STATUS.OUT_WEEK_DAY:
      return I18n.t('distanceMessageOutsideWeekDay');
    case DEF.STATUS.OUT_TIME:
      return I18n.t('distanceMessageOutsideTime');
  }
};
const nearestStationPart = { name: '', distanceKm: '' };
export class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      nearestStation: null,
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
      let initOwnInfo = await json.getStorageDataOwnInfo();
      this.props.setOwnInfoCoords(initOwnInfo.coords);
      this.handleGetLatAndLng();

      this.timer = setInterval(async () => {
        let ownInfo = await json.getStorageDataOwnInfo();
        this.props.setOwnInfoCoords(ownInfo.coords);
        this.setState({ isFetching: false });
        this.handleGetLatAndLng();
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
    } catch (e) {
      // alert(e.message);
    }
  }

  componentDidUpdate() {
    if (before != this.props.alermList) {
      // 設定が変わったら再設定
      clearBefore();
      startLocation(this.props.ownInfo, this.props.alermList);
      before = this.props.alermList;
    }
  }

  handleGetLatAndLng() {
    let option = {
      x: this.props.ownInfo.coords.longitude,
      y: this.props.ownInfo.coords.latitude,
      output: 'json',
    };
    axios
      .get(GEOCODE_ENDPOINT, { params: option })
      .then(results => {
        const datas = results.data;
        if (datas != null || datas.length > 0) {
          const newDatas = datas.filter(n => n.distance <= 1500);
          this.setState({ nearestStation: newDatas });
        }
      })
      .catch(() => {});
  }

  render() {
    const editRegistBtn = index => {
      this.props.setOwnInfoSelectedIndex(index);
      this.props.navigation.navigate('EditRegist');
    };

    const swipeBtns = index => [
      {
        text: I18n.t('del'),
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

    const nearestStationPart = (nearestStation, index) => {
      if (nearestStation == null || nearestStation[index] == null) {
        return;
      }
      const station = nearestStation[index];
      return (
        <View style={styles.nearRestInfo}>
          <Text style={styles.nearRestName} numberOfLines={1}>
            {station != null ? station.name : ''}
          </Text>
          <Text style={styles.nearRestDistance} numberOfLines={1}>
            {station != null ? station.distanceM : ''}
          </Text>
        </View>
      );
    };
    const nearestStation = nearestStation => {
      return (
        <View style={styles.nearRest}>
          <Text
            style={[styles.nearRestTitle, { backgroundColor: 'darkgreen' }]}>
            {I18n.t('nearest')}
          </Text>
          <FlatList
            data={this.state.nearestStation}
            extraData={this.state.nearestStation}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.nearRestInfo}>
                <MaterialIcons name="train" size={ICON_SIZE} color="orange" />
                <Text style={styles.nearRestName}>
                  {exceptStationLine(item.line) + item.name}
                </Text>
                <Text style={styles.nearRestDistance}>{item.distanceKm}</Text>
              </View>
            )}
          />
        </View>
      );
    };

    return (
      <View style={styles.container}>
        {topHeader(this.props)}
        {nearest && nearestStation(this.state.nearestStation)}
        <ScrollView>
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
        </ScrollView>
        {this.props.ownInfo.isFree && admobBanner()}
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
  setOwnInfoReviewed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Top);
