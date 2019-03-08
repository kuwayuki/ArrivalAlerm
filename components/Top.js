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
let json = require('../assets/setting.json');

const getJsonData = () => {
  // console.log(json);
  // console.log(json[0]);
  // console.log(json[1]);
  // console.log(json[0].index);
};

export class Top extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    getJsonData();

    this.state = {
      data: [
        {
          title: '秋葉原駅',
          isAvailable: true,
          distance: '10.0\nkm',
          interval: '5秒',
          timeZone: '5:00 ~ 12:00',
        },
        {
          title: '川崎駅',
          isAvailable: false,
          distance: '10.0\nkm',
          interval: '5秒',
          timeZone: '5:00 ~ 12:00',
        },
        {
          title: '川崎駅',
          isAvailable: false,
          distance: '10.0\nkm',
          interval: '5秒',
          timeZone: '5:00 ~ 12:00',
        },
      ],
    };
  }
  switchValue = value => {
    this.setState({ switching: value });
    const switchText = value ? 'ON' : 'OFF';
  };

  render() {
    const swipeBtns = [
      {
        text: '削除',
        backgroundColor: 'red',
        underlayColor: 'rgba(0,0,0,1)',
        // onPress: () => { this._completePhrase({ item, index }) },
      },
    ];

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
              right={swipeBtns}
              autoClose={true}
              backgroundColor="transparent">
              <View style={styles.ListRow}>
                <Text
                  style={styles.itemFocus}
                  onPress={() => this.props.navigation.navigate('Stack2')}>
                  {utils.distanceMtoKm(item.distance)}
                  {'\nkm'}
                </Text>
                <Text
                  style={styles.item}
                  // onPress={() => alert(item.title)}>
                  onPress={() => this.props.navigation.navigate('Stack2')}>
                  {item.title}
                  {'\n'}
                  {item.interval + ' ' + item.timeZoneStart + '～' + item.timeZoneEnd}
                </Text>
                <Switch
                  style={styles.itemSwitch}
                  onValueChange={this.switchValue}
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

export default connect(mapStateToProps)(Top);
