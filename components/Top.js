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
              distance: '10.0km',
              interval: '5秒',
              timeZone: '5:00 ~ 12:00',
            },
            {
              title: '川崎駅',
              isAvailable: false,
              distance: '10.0km',
              interval: '5秒',
              timeZone: '5:00 ~ 12:00',
            },
          ]}
          extraData={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => (
            <View style={styles.movieView}>
              <Text
                style={styles.itemFocus}
                onPress={() => this.props.navigation.navigate('Stack2')}>
                {item.distance}
              </Text>
              <Text
                style={styles.item}
                // onPress={() => alert(item.title)}>
                onPress={() => this.props.navigation.navigate('Stack2')}>
                {item.title + ' ' + item.distance}
                {'\n'}
                {item.interval + ' ' + item.timeZone}
              </Text>
              <Switch
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
    flex: 1,
  },
  movieView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#c6e6fa',
    padding: 5,
    fontSize: 18,
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
  },
  itemFocus: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'lightblue',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'lightblue',
    overflow: 'hidden',
    // backgroundColor: '#000000',
  },
  item: {
    fontSize: 18,
  },
});
