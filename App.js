import * as React from 'react';
import { Text, View, StyleSheet, Button, AppRegistry } from 'react-native';
import { Constants } from 'expo';
import { createStore } from 'redux';
// You can import from local files
import Top from './components/Top';
import NewRegist from './components/NewRegist';
import EditRegist from './components/EditRegist';
import {
  createMaterialTopTabNavigator,
  createTabNavigator,
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
} from 'react-navigation';
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import { Provider } from 'react-redux';
import { reducers } from './reducers/index';

const store = createStore(reducers);

// 「Tab1Screen」というコンポーネント（＝画面のようなもの）を定義
class Tab1Screen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>タブ1</Text>
      </View>
    );
  }
}

// 「Tab2Screen」というコンポーネント（＝画面のようなもの）を定義
class Tab2Screen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>タブ2</Text>
      </View>
    );
  }
}

// ＊ポイント
// `createBottomTabNavigator`で`Tab1`と`Tab2`の間をどのようなナビゲーションで結びつけるか設定
const RootStack = createBottomTabNavigator(
  {
    Tab1: Tab1Screen,
    Tab2: Tab2Screen,
  },
  {
    initialRouteName: 'Tab1',
  }
);
const Stack = createStackNavigator(
  {
    Stack1: {
      screen: Top,
      navigationOptions: {
        header: null,
        // title: 'Home',
      },
    },
    Stack3: {
      screen: EditRegist,
      navigationOptions: {
        header: null,
      },
    },
    Stack2: {
      screen: NewRegist,
      navigationOptions: () => ({
        title: null,
        // title: '新規登録',
      }),
    },
  },
  {
    initialRouteName: 'Stack1',
  }
);
const AppContainer = createAppContainer(Stack);
const HeaderContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppContainer
            ref={nav => {
              this.navigator = nav;
            }}
          />
        </View>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: 'aliceblue',
  },
});
