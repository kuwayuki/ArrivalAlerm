import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Switch,
  Alert,
  Vibration,
} from 'react-native';
import { Header } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import * as utils from '../containers/utils';
import * as json from '../containers/jsonFile';
import { _handleNotification, startLocation } from '../containers/location';
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
import { Location, TaskManager, Notifications, Speech } from 'expo';

export class Top extends Component {
  constructor(props) {
    super(props);
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

    const settingBtn = index => {
      this.props.navigation.navigate('Setting');
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
            onPress: () => settingBtn(),
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
                    numberOfLines={1}
                    onPress={() => editRegistBtn(item.index)}>
                    {item.title}
                  </Text>
                  <Text
                    style={styles.itemDis}
                    numberOfLines={1}
                    onPress={() => editRegistBtn(item.index)}>
                    {utils.getRimDistance(
                      this.props.ownInfo.coords,
                      item.coords,
                      item.alermDistance
                    )}
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
    paddingTop: 5,
    paddingLeft: 3,
    fontSize: 20,
  },
  itemDis: {
    paddingTop: 5,
    paddingLeft: 3,
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
