import * as React from 'react';
import { Text, View, StyleSheet, Button, AppRegistry } from 'react-native';
import { Constants } from 'expo';
import { createStore } from 'redux';
import Top from './components/Top';
import NewRegist from './components/NewRegist';
import Search from './components/Search';
import EditRegist from './components/EditRegist';
import Setting from './components/Setting';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { rootReducer } from './reducers/index';

export const store = createStore(rootReducer);

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
        // title: '新規登録',
      },
    },
    Search: {
      screen: Search,
      navigationOptions: {
        // title: '新規登録',
      },
    },
    EditRegist: {
      screen: EditRegist,
      navigationOptions: {},
    },
    Setting: {
      screen: Setting,
      navigationOptions: {
        // title: '新規登録',
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
