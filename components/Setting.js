import * as React from 'react';
import { Text, Switch, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { setOwnInfoSetting } from '../actions/actions';
import { PERFORMANCE_KIND } from '../constants/constants';
import { Header, Button, ButtonGroup } from 'react-native-elements';
import { startLocation } from '../containers/location';
import * as json from '../containers/jsonFile';

export class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      performanceSelect: props.ownInfo.performance == 0,
      performance:
        props.ownInfo.performance == 0 ? -1 : props.ownInfo.performance - 1,
      distance: props.ownInfo.distance,
    };
  }

  settingUpdate() {
    let ownInfo = {};
    Object.assign(ownInfo, this.props.ownInfo);
    let performance = 0;
    if (!this.state.performanceSelect) {
      performance = this.state.performance + 1;
    }
    ownInfo.performance = performance;
    ownInfo.distance = this.state.distance;
    json.setStorageDataOwnInfo(ownInfo);
    startLocation(ownInfo, this.props.alermList);
    this.props.setOwnInfoSetting(ownInfo);
    this.props.navigation.navigate('Top');
  }

  clearSetting() {
    json.clearAsyncStorage();
    this.props.navigation.navigate('Top');
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{
            text: '戻る',
            style: { color: '#fff' },
            onPress: () => this.props.navigation.navigate('Top'),
          }}
          centerComponent={{ text: '編集', style: { color: '#fff' } }}
          rightComponent={{
            text: '更新',
            style: { color: '#fff' },
            onPress: () => this.settingUpdate(),
          }}
        />
        <Text style={styles.sectionHeader}>位置情報取得</Text>
        <Text style={styles.sectionHeader}>位置情報取得間隔</Text>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.performanceSelect ? '自動' : '指定'}
          </Text>
          <Switch
            style={styles.setting}
            onValueChange={performanceSelect =>
              this.setState({ performanceSelect })
            }
            value={this.state.performanceSelect}
          />
        </View>
        {!this.state.performanceSelect && (
          <View style={styles.bgColorWhite}>
            <ButtonGroup
              onPress={performance => this.setState({ performance })}
              selectedButtonStyle={styles.bgColorSelected}
              buttons={PERFORMANCE_KIND}
              selectedIndex={this.state.performance}
            />
          </View>
        )}
        <View style={styles.rowTextSetting}>
          <Text>
            {!this.state.performanceSelect
              ? '高いほど位置情報が正確になりますが、 消費電力もあがります。'
              : '登録地点に従って自動で設定します。'}
          </Text>
        </View>
        <Text style={styles.sectionHeader}>位置情報取得間隔</Text>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.performanceSelect ? '自動' : '指定'}
          </Text>
          <Switch
            style={styles.setting}
            onValueChange={performanceSelect =>
              this.setState({ performanceSelect })
            }
            value={this.state.performanceSelect}
          />
        </View>
        {!this.state.performanceSelect && (
          <View style={styles.bgColorWhite}>
            <ButtonGroup
              onPress={this.selectedDistanceClick}
              selectedButtonStyle={styles.bgColorSelected}
              buttons={PERFORMANCE_KIND}
              selectedIndex={this.state.selectedDistanceIndex}
            />
          </View>
        )}
        <View style={styles.rowTextSetting}>
          <Text>
            {!this.state.performanceSelect
              ? '高いほど位置情報が正確になりますが、 消費電力もあがります。'
              : '登録地点に従って自動で設定します。'}
          </Text>
        </View>
        <Button title="更新" onPress={() => this.settingUpdate()} />
        <Button title="初期化" onPress={() => this.clearSetting()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'aliceblue',
    flex: 1,
  },
  sectionHeader: {
    color: 'white',
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'turquoise',
    // backgroundColor: 'lightblue',
    // backgroundColor: 'deepskyblue',
    // backgroundColor: 'slateblue',
    // backgroundColor: 'yellowgreen',
    // backgroundColor: 'lightskyblue',
    // backgroundColor: 'aquamarine',
    // backgroundColor: 'azure',
    // backgroundColor: 'aliceblue',
    // backgroundColor: 'aqua',
    // backgroundColor: 'coral',
    // backgroundColor: 'cornflowerblue',
    // backgroundColor: 'crimson',
    // backgroundColor: 'darkgray',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
  },
  item: {
    padding: 10,
    margin: 0,
    paddingLeft: 50,
    fontSize: 18,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    // textAlign: 'right',
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  rowTextSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 0.25,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    width: '80%',
    paddingLeft: 30,
    fontSize: 18,
    // textAlign: 'right',
  },
  bgColorWhite: {
    backgroundColor: 'white',
  },
  bgColorSelected: {
    backgroundColor: 'cornflowerblue',
  },
  setting: {
    paddingLeft: 150,
  },
});

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  setOwnInfoSetting,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setting);
