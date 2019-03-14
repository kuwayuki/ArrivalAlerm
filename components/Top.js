import React, { Component } from 'react';
import {
  AppRegistry,
  SectionList,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  AsyncStorage,
  Permissions,
  Alert,
} from 'react-native';
import { Header } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import * as utils from '../containers/utils';
import * as json from '../containers/jsonFile';
import { checkPosition, getCurrentPosition } from '../containers/position';
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
import { Location, TaskManager, Notifications } from 'expo';
const LOCATION_TASK_NAME = 'background-location-task';

// async function registerForPushNotificationsAsync() {
//   const { status: existingStatus } = await Permissions.getAsync(
//     Permissions.NOTIFICATIONS
//   );
//   let finalStatus = existingStatus;

//   // only ask if permissions have not already been determined, because
//   // iOS won't necessarily prompt the user a second time.
//   if (existingStatus !== 'granted') {
//     // Android remote notification permissions are granted during the app
//     // install, so this will only ask on iOS
//     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//     finalStatus = status;
//   }

//   // Stop here if the user did not grant permissions
//   if (finalStatus !== 'granted') {
//     return;
//   }

//   // Get the token that uniquely identifies this device
//   let token = await Notifications.getExpoPushTokenAsync();

//   const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

//   // POST the token to your backend server from where you can retrieve it to send push notifications.
//   return fetch(PUSH_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       token: {
//         value: token,
//       },
//       user: {
//         username: 'Brent',
//       },
//     }),
//   });
// }

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;
    await json.mergeStorageDataOwnInfo(locations[0]);
    // AsyncStorageより情報取得
    let alermList = await json.getAllStorageDataAlermList();
    let ownInfo = await json.getStorageDataOwnInfo();
    await checkPosition(ownInfo, alermList);
  }
});

export class Top extends Component {
  constructor(props) {
    super(props);
  }
  _handleNotification = notification => {
    if (notification.origin === 'selected') {
      //バックグラウンドで通知
    } else if (notification.origin === 'received') {
      //フォアグラウンドで通知
      Alert.alert('通知が来ました:' + notification.data.name);
      console.log(notification.data.name);
    }
  };
  async componentDidMount() {
    try {
      // registerForPushNotificationsAsync();
      Notifications.addListener(this._handleNotification);
      TaskManager.unregisterAllTasksAsync();
      await utils.initNotification();
      // 現在地取得
      const position = await getCurrentPosition(5000);
      this.props.setOwnInfoCoords(position.coords);
      // 設定済情報取得
      await json.getJsonData(this.props);
      Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        // accuracy: Location.Accuracy.High,
        // accuracy: Location.Accuracy.BestForNavigation,
        accuracy: Location.Accuracy.Balanced,
        // timeInterval: 100000,
        // showsBackgroundLocationIndicator: true,
        // distanceInterval: 10,
      });
    } catch (e) {
      // alert(e.message);
    }
  }

  render() {
    const newRegistBtn = () => {
      let count = this.props.alermList.length;
      if (this.props.ownInfo.isFree && count > DEF.MAX_TRIAL) {
        alert('無料版は' + (DEF.MAX_TRIAL + 1) + '件までしか登録できません。');
      } else if (count > DEF.MAX_OFFICAL) {
        alert(DEF.MAX_OFFICAL + 1 + '件までしか登録できません。');
      } else {
        this.props.navigation.navigate('NewRegist');
      }
    };

    const editRegistBtn = index => {
      this.props.setOwnInfoSelectedIndex(index);
      this.props.navigation.navigate('EditRegist');
    };

    const swipeBtns = index => [
      {
        text: '削除',
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
        <Header
          leftComponent={{
            icon: 'settings',
            color: '#fff',
            onPress: async () => {
              console.log('ccc');
              // let notificationId = await Notifications.presentLocalNotificationAsync(
              // let local = {
              let notificationId = await Notifications.presentLocalNotificationAsync(
                {
                  title: 'This is crazy',
                  body: 'Your mind will blow after reading this',
                }
              );
              // let token = await Notifications.getExpoPushTokenAsync();
              // console.log(token);

              // Notifications.scheduleLocalNotificationAsync(local, {
              //   time: new Date().getTime() + 1000,
              // });
              // TaskManager.unregisterAllTasksAsync();
              // json.clearAsyncStorage();
            },
          }}
          centerComponent={{ text: 'Home', style: { color: '#fff' } }}
          rightComponent={{
            icon: 'add',
            color: '#fff',
            onPress: () => newRegistBtn(),
          }}
        />
        <FlatList
          data={this.props.alermList}
          extraData={this.props.alermList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Swipeout
              right={swipeBtns(item.index)}
              autoClose={true}
              backgroundColor="transparent">
              <View style={styles.ListRow}>
                <Text
                  style={styles.itemFocus}
                  onPress={() => editRegistBtn(item.index)}>
                  {utils.getDistance(this.props.ownInfo.coords, item.coords)}
                </Text>
                <View style={styles.viewMiddle}>
                  <Text
                    style={styles.item}
                    selectable={false}
                    accessible={false}
                    allowFontScaling={false}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                    // onPress={() => alert(item.title)}>
                    onPress={() => editRegistBtn(item.index)}>
                    {item.title}
                  </Text>
                  <Text
                    style={styles.item}
                    selectable={false}
                    accessible={false}
                    allowFontScaling={false}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                    // onPress={() => alert(item.title)}>
                    onPress={() => editRegistBtn(item.index)}>
                    {item.title}
                  </Text>
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
              </View>
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
  viewMiddle: {
    width: '60%',
  },
  item: {
    padding: 3,
    fontSize: 18,
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
