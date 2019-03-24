import * as React from 'react';
import { Text, Switch, View, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  setOwnInfoSetting,
  setOwnInfoCoords,
  clearStore,
} from '../actions/actions';
import { PERFORMANCE_KIND } from '../constants/constants';
import { Header, Button, ButtonGroup } from 'react-native-elements';
import { startLocation } from '../containers/location';
import * as json from '../containers/jsonFile';
import { LANGUAGE } from '../constants/language';
import { getCurrentPosition } from '../containers/position';
import { settingHeader } from '../containers/header';

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

  clearSetting() {
    Alert.alert(LANGUAGE.wd.initialize, LANGUAGE.wd.initializeQuestion, [
      {
        text: 'OK',
        onPress: async () => {
          this.props.clearStore();
          const position = await getCurrentPosition(5000);
          this.props.setOwnInfoCoords(position.coords);
          Alert.alert(LANGUAGE.wd.initialize, LANGUAGE.wd.initializeOK, [
            {
              text: 'OK',
              onPress: async () => {
                json.clearAsyncStorage();
                // 設定済情報取得
                await json.getJsonData(this.props);
                this.props.navigation.navigate('Top');
              },
            },
          ]);
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  }

  render() {
    return (
      <View style={styles.container}>
        {settingHeader(this.state, this.props)}
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.getLocation}</Text>
        <Text style={styles.sectionHeader}>
          {LANGUAGE.wd.getLocationInterval}
        </Text>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.performanceSelect
              ? LANGUAGE.wd.auto
              : LANGUAGE.wd.choice}
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
          <Text style={styles.textDes}>
            {!this.state.performanceSelect
              ? LANGUAGE.wd.getLocationDesChoice
              : LANGUAGE.wd.getLocationDesAuto}
          </Text>
        </View>
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.other}</Text>
        {this.props.isFree && (
          <View style={styles.rowTextSetting}>
            <Text style={styles.textDes}>{LANGUAGE.wd.payDes}</Text>
            <Button
              style={styles.button}
              title={LANGUAGE.wd.pay}
              onPress={() => this.clearSetting()}
            />
          </View>
        )}
        <View style={styles.rowTextSetting}>
          <Text style={styles.textDes}>{LANGUAGE.wd.initializeDes}</Text>
          <Button
            style={styles.button}
            buttonStyle={styles.bgColorRed}
            title={LANGUAGE.wd.initialize}
            onPress={() => this.clearSetting()}
          />
        </View>
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
  textDes: {
    paddingLeft: 30,
    fontSize: 14,
    // textAlign: 'right',
  },
  text: {
    width: '60%',
    paddingLeft: 30,
    fontSize: 18,
    // textAlign: 'right',
  },
  button: {
    width: 90,
    paddingRight: 20,
  },
  setting: {
    width: 80,
  },
  bgColorWhite: {
    backgroundColor: 'white',
  },
  bgColorRed: {
    backgroundColor: 'red',
  },
  bgColorSelected: {
    backgroundColor: 'cornflowerblue',
  },
});

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  setOwnInfoSetting,
  setOwnInfoCoords,
  clearStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setting);
