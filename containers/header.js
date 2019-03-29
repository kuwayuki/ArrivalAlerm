import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { LANGUAGE } from '../constants/language';
import * as DEF from '../constants/constants';
import * as json from '../containers/jsonFile';
import { getNumTime, getTimeFromDateTime } from '../containers/utils';

const BG_COLOR = 'royalblue';
const ICON_COLOR = '#fff';
const ICON_SIZE = 30;
const FONT_SIZE = 18;

const settingBtn = props => {
  props.navigation.navigate('Setting');
};

export const newRegistBtn = props => {
  let count = props.alermList.length;
  if (props.ownInfo.isFree && count > DEF.MAX_TRIAL) {
    alert(
      LANGUAGE.wd.freeAlert1 + (DEF.MAX_TRIAL + 1) + LANGUAGE.wd.freeAlert2
    );
  } else if (count > DEF.MAX_OFFICAL) {
    alert(DEF.MAX_OFFICAL + 1 + LANGUAGE.wd.freeAlert2);
  } else {
    // props.navigation.navigate('Search');
    props.navigation.navigate('NewRegist');
  }
};

const settingUpdate = (state, props) => {
  let ownInfo = {};
  Object.assign(ownInfo, props.ownInfo);
  let performance = 0;
  if (!state.performanceSelect) {
    performance = state.performance + 1;
  }
  ownInfo.performance = performance;
  ownInfo.distance = state.distance;
  ownInfo.sound = state.sound;
  json.setStorageDataOwnInfo(ownInfo);
  props.setOwnInfoSetting(ownInfo);
  props.navigation.navigate('Top');
};

async function newMarkerClick(state, props) {
  let item = {};
  Object.assign(item, DEF.INITIAL_ITEM);
  let markers = state.markers.slice();
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
  item.timeZoneStart =
    String(startTime).substr(0, String(startTime).length - 2) + ':00';
  item.timeZoneEnd =
    String(endTime).substr(0, String(endTime).length - 2) + ':00';
  props.addAlermItem(item);
  json.addAsyncStorage(item);
  props.navigation.navigate('Top');
}

async function editMarkerClick(state, props, listIndex) {
  let item = {};
  Object.assign(item, props.alermList[listIndex]);
  let markers = state.markers.slice();
  item.title = state.title;
  item.alermMessage = state.title + LANGUAGE.wd.arrivedNear;
  item.isAlermed = false;
  item.alermDistance = Number(state.alermDistance);
  item.isLimitTimeZone = state.isLimitTimeZone;
  item.timeZoneStart = state.timeZoneStart;
  item.timeZoneEnd = state.timeZoneEnd;
  item.isLimitWeekDay = state.isLimitWeekDay;
  item.isMonday = state.isMonday;
  item.isTuesday = state.isTuesday;
  item.isWednesday = state.isWednesday;
  item.isThursday = state.isThursday;
  item.isFriday = state.isFriday;
  item.isSaturday = state.isSaturday;
  item.isSunday = state.isSunday;
  item.coords = markers[0].latlng;
  props.setAlermItem(item);
  json.addAsyncStorage(item);
  props.navigation.navigate('Top');
}
export const topHeader = props => {
  let speed = props.ownInfo.coords.speed;
  let homeIcon = 'home';
  let type = 'material';
  if (speed < 0.2) {
    // 停滞・維持レベル(目的地までの距離)
    homeIcon = 'home';
  }
  else if (speed < 1) {
    // 停滞・維持レベル(目的地までの距離)
    homeIcon = 'airline-seat-recline-normal';
  } else if (speed < 10) {
    // 徒歩レベル(目的地までの距離)
    homeIcon = 'directions-walk';
  } else if (speed < 30) {
    // 電車・車レベル(目的地までの距離と通知距離に反比例)
    homeIcon = 'train';
  } else {
    // 新幹線レベル
    homeIcon = 'car-traction-control';
    type = 'material-community';
  }

  return (
    <Header
      leftComponent={{
        icon: 'settings',
        color: ICON_COLOR,
        size: ICON_SIZE,
        underlayColor: BG_COLOR,
        onPress: () => settingBtn(props),
      }}
      centerComponent={{
        icon: homeIcon,
        type: type,
        color: ICON_COLOR,
        size: ICON_SIZE,
      }}
      rightComponent={{
        icon: 'add',
        color: ICON_COLOR,
        size: ICON_SIZE,
        underlayColor: BG_COLOR,
        onPress: () => newRegistBtn(props),
      }}
      containerStyle={{
        backgroundColor: BG_COLOR,
        justifyContent: 'space-around',
      }}
    />
  );
};

export const newRegistHeader = (state, props) => {
  return (
    <Header
      leftComponent={{
        icon: 'arrow-back',
        color: ICON_COLOR,
        size: ICON_SIZE,
        underlayColor: BG_COLOR,
        onPress: () => props.navigation.navigate('Top'),
      }}
      centerComponent={{
        icon: 'map',
        color: ICON_COLOR,
        size: ICON_SIZE,
      }}
      rightComponent={{
        text: LANGUAGE.wd.decision,
        style: { color: ICON_COLOR, fontSize: FONT_SIZE },
        underlayColor: BG_COLOR,
        onPress: () => newMarkerClick(state, props),
      }}
      containerStyle={{
        backgroundColor: BG_COLOR,
        justifyContent: 'space-around',
      }}
    />
  );
};

export const searchHeader = props => {
  return (
    <Header
      leftComponent={{
        icon: 'arrow-back',
        color: ICON_COLOR,
        size: ICON_SIZE,
        underlayColor: BG_COLOR,
        onPress: () => props.navigation.navigate('Top'),
      }}
      centerComponent={{
        icon: 'map',
        color: ICON_COLOR,
        size: ICON_SIZE,
      }}
      rightComponent={{
        text: LANGUAGE.wd.decision,
        style: { color: ICON_COLOR, fontSize: FONT_SIZE },
        underlayColor: BG_COLOR,
        onPress: () => newRegistBtn(props),
      }}
      containerStyle={{
        backgroundColor: BG_COLOR,
        justifyContent: 'space-around',
      }}
    />
  );
};

export const editRegistHeader = (state, props, listIndex) => {
  return (
    <Header
      leftComponent={{
        icon: 'arrow-back',
        color: ICON_COLOR,
        size: ICON_SIZE,
        underlayColor: BG_COLOR,
        onPress: () => props.navigation.navigate('Top'),
      }}
      centerComponent={{
        icon: 'explore',
        color: ICON_COLOR,
        size: ICON_SIZE,
      }}
      rightComponent={{
        text: LANGUAGE.wd.decision,
        style: { color: ICON_COLOR, fontSize: FONT_SIZE },
        underlayColor: BG_COLOR,
        onPress: () => editMarkerClick(state, props, listIndex),
      }}
      containerStyle={{
        backgroundColor: BG_COLOR,
        justifyContent: 'space-around',
      }}
    />
  );
};

export const settingHeader = (state, props) => {
  return (
    <Header
      leftComponent={{
        icon: 'arrow-back',
        color: ICON_COLOR,
        size: ICON_SIZE,
        underlayColor: BG_COLOR,
        onPress: () => props.navigation.navigate('Top'),
      }}
      centerComponent={{ icon: 'settings', color: ICON_COLOR, size: ICON_SIZE }}
      rightComponent={{
        text: LANGUAGE.wd.update,
        style: { color: ICON_COLOR, fontSize: FONT_SIZE },
        underlayColor: BG_COLOR,
        onPress: () => settingUpdate(state, props),
      }}
      containerStyle={{
        backgroundColor: BG_COLOR,
        justifyContent: 'space-around',
      }}
    />
  );
};
