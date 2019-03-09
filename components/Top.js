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
} from 'react-native';
import { Header } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import * as utils from '../containers/utils';
import { getCurrentPosition } from '../containers/position';
import {
  setOwnInfoCoords,
  addAlermItem,
  deleteAlermItem,
  setAlermAvailable,
} from '../actions/actions';

let json = require('../assets/setting.json');
async function getJsonData(props) {
  var matchData = json.filter(function(item, index) {
    // 通知項目情報取得
    if (item.key == 'alermItem') {
      // 通知箇所との距離取得
      item.distance = utils.getDistance(
        props.ownInfo.coords.latitude,
        props.ownInfo.coords.longitude,
        item.coords.latitude,
        item.coords.longitude
      );

      props.addAlermItem(item);
    }
  });
}

export class Top extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    try {
      // 現在地取得
      const position = await getCurrentPosition(5000);
      this.props.setOwnInfoCoords(position.coords);

      // 設定済情報取得
      await getJsonData(this.props);
    } catch (e) {
      alert(e.message);
    }
  }

  render() {
    const swipeBtns = index => [
      {
        text: '削除',
        backgroundColor: 'red',
        underlayColor: 'rgba(0,0,0,1)',
        onPress: () => {
          this.props.deleteAlermItem(index);
        },
      },
    ];

    const switchValue = index => {
      console.log(index);
      // this.props.setAlermAvailable(index);
    };

    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'settings', color: '#fff' }}
          centerComponent={{ text: 'Home', style: { color: '#fff' } }}
          rightComponent={{
            icon: 'add',
            color: '#fff',
            onPress: () => this.props.navigation.navigate('Stack2'),
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
                  onPress={() => this.props.navigation.navigate('Stack2')}>
                  {item.distance}
                  {'\nkm'}
                </Text>
                <Text
                  style={styles.item}
                  // onPress={() => alert(item.title)}>
                  onPress={() => this.props.navigation.navigate('Stack2')}>
                  {item.title}
                  {'\n'}
                  {item.interval +
                    ' ' +
                    item.timeZoneStart +
                    '～' +
                    item.timeZoneEnd}
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
    // color: 'white',
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

function mapStateToProps(state) {
  return state;
}
const mapDispatchToProps = {
  setOwnInfoCoords,
  addAlermItem,
  deleteAlermItem,
  setAlermAvailable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Top);
