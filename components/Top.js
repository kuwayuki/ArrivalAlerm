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

export default class SectionListBasics extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  switchValue = value => {
    this.setState({ switching: value });
    const switchText = value ? 'ON' : 'OFF';
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
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
          ]}
          extraData={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => (
            <View style={styles.ListRow}>
              <Text
                style={styles.itemFocus}
                onPress={() => this.props.navigation.navigate('Stack2')}>
                {item.distance}
              </Text>
              <Text
                style={styles.item}
                // onPress={() => alert(item.title)}>
                onPress={() => this.props.navigation.navigate('Stack2')}>
                {item.title}
                {'\n'}
                {item.interval + ' ' + item.timeZone}
              </Text>
              <Switch
                style={styles.itemSwitch}
                onValueChange={this.switchValue}
                value={item.isAvailable}
              />
            </View>
          )}
        />
        <Button
          title="編集へ"
          onPress={() => this.props.navigation.navigate('Stack2')}
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
    padding: 5,
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
    // backgroundColor: 'azure',
    // backgroundColor: 'aliceblue',
    backgroundColor: 'aquamarine',
    // backgroundColor: 'aqua',
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
    fontSize: 17,
    // backgroundColor: '#000000',
  },
  item: {
    width: '60%',
    fontSize: 18,
  },
  itemSwitch: {
  },
});
