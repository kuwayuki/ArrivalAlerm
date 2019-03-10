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
  Vibration,
  Notifications,
} from 'react-native';
import { Header } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import * as utils from '../containers/utils';
import * as json from '../containers/jsonFile';
import { getCurrentPosition } from '../containers/position';
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
import { Location, TaskManager } from 'expo';
const LOCATION_TASK_NAME = 'background-location-task';

export class Top extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    try {
      // 現在地取得
      const position = await getCurrentPosition(5000);
      this.props.setOwnInfoCoords(position.coords);
      // this.timerGetPosition();
      // 設定済情報取得
      await json.getJsonData(this.props);
      // Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      //   // accuracy: Location.Accuracy.High,
      //   // accuracy: Location.Accuracy.BestForNavigation,
      //   accuracy: Location.Accuracy.Balanced,
      //   // timeInterval: 10000,
      //   // distanceInterval: 100,
      // });
    } catch (e) {
      // alert(e.message);
    }
  }

  render() {
    const setStore = (coords, props) => {
      props.setOwnInfoCoords(coords);
      props.refleshAlermItem(coords);
    };

    // TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    //   if (this.props.alermList.length == 0) {
    //     // json.getJsonData(this.props);
    //     return;
    //   }
    //   if (error) {
    //     // console.log(error);
    //     return;
    //   }
    //   if (data) {
    //     const { locations } = data;
    //     setStore(locations[0].coords, this.props);
    //   }
    // });

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
            onPress: () => json.clearAsyncStorage(),
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
          keyExtractor={this._keyExtractor}
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
                <Text
                  style={styles.item}
                  selectable={false}
                  accessible={false}
                  allowFontScaling={false}
                  // onPress={() => alert(item.title)}>
                  onPress={() => editRegistBtn(item.index)}>
                  {item.title}
                </Text>
                <Switch
                  style={styles.itemSwitch}
                  onValueChange={() => this.props.setAlermAvailable(item.index)}
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
  item: {
    width: '58%',
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
