import * as React from 'react';
import { Text, View, StyleSheet, Button, AppRegistry } from 'react-native';
import { Constants } from 'expo';
import { createStore } from 'redux';
import Top from './components/Top';
import NewRegist from './components/NewRegist';
import EditRegist from './components/EditRegist';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Card } from 'react-native-paper';
import { Provider } from 'react-redux';
import { reducers } from './reducers/index';

export const store = createStore(reducers);

const Stack = createStackNavigator(
  {
    Top: {
      screen: Top,
      navigationOptions: {
        header: null,
        headerBackTitleVisible: false,
        // title: 'Home',
      },
    },
    NewRegist: {
      screen: NewRegist,
      navigationOptions: {
        title: null,
        headerMode: 'none',
        headerBackTitle: 'Backa',
        headerBackTitleVisible: false,
        // title: '新規登録',
      },
    },
    EditRegist: {
      screen: EditRegist,
      navigationOptions: {
        header: null,
        headerBackTitleVisible: false,
      },
    },
  },
  {
    initialRouteName: 'Top',
    headerMode: 'none',
  }
);
const AppContainer = createAppContainer(Stack);

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
          <AppContainer />
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
