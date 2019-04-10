import * as React from 'react';
import { Text, Switch, View, Alert, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import {
  setOwnInfo,
  setOwnInfoSetting,
  setOwnInfoCoords,
  clearStore,
} from '../actions/actions';
import { Button, ButtonGroup } from 'react-native-elements';
import AppLink from 'react-native-app-link';
import { PERFORMANCE_KIND, SORT_KIND } from '../constants/constants';
import { LANGUAGE } from '../constants/language';
import * as json from '../containers/jsonFile';
import { styles } from '../containers/styles';
import { getCurrentPosition } from '../containers/position';
import { settingHeader } from '../containers/header';
import { admobInterstitial } from '../containers/googleAdmob';

export class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      performanceSelect: props.ownInfo.performance == 0,
      performance:
        props.ownInfo.performance == 0 ? -1 : props.ownInfo.performance - 1,
      distance: props.ownInfo.distance,
      sound: props.ownInfo.sound,
      recoveryTime: props.ownInfo.recoveryTime > 0,
      recoveryDistance: props.ownInfo.recoveryDistance,
      sortKind: props.ownInfo.sortKind,
      sortType: props.ownInfo.sortType,
    };
  }

  async componentDidMount() {
    if (this.props.ownInfo.isFree) {
      await admobInterstitial();
    }
  }

  buyStore() {
    let appStoreId = 'id443904275';
    let playStoreId = 'id443904275';

    AppLink.openInStore({ appStoreId, playStoreId })
      .then(() => {
        // do stuff
      })
      .catch(err => {
        // handle error
      });
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

  getDesDitance = index => {
    let text = LANGUAGE.wd.getLocationDesChoice;
    switch (index) {
      case 0:
        text = LANGUAGE.wd.getLocationDesChoiceLowest;
        break;
      case 1:
        text = LANGUAGE.wd.getLocationDesChoiceLow;
        break;
      case 2:
        text = LANGUAGE.wd.getLocationDesChoiceBalanced;
        break;
      case 3:
        text = LANGUAGE.wd.getLocationDesChoiceHigh;
        break;
      case 4:
        text = LANGUAGE.wd.getLocationDesChoicehigHest;
        break;
      case 5:
        text = LANGUAGE.wd.getLocationDesChoicehigBest;
        break;
    }
    return text;
  };
  render() {
    return (
      <View style={styles.container}>
        {settingHeader(this.state, this.props)}
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.getLocation}</Text>
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
              ? this.getDesDitance(this.state.performance)
              : LANGUAGE.wd.getLocationDesAuto}
          </Text>
        </View>
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.sort}</Text>
        <View style={styles.bgColorWhite}>
          <ButtonGroup
            onPress={sortKind => this.setState({ sortKind })}
            selectedButtonStyle={styles.bgColorSelected}
            buttons={SORT_KIND}
            selectedIndex={this.state.sortKind}
          />
        </View>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.sortType
              ? LANGUAGE.wd.sortNormal
              : LANGUAGE.wd.sortReverse}
          </Text>
          <Switch
            style={styles.setting}
            onValueChange={sortType => this.setState({ sortType })}
            value={this.state.sortType}
          />
        </View>
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.sound}</Text>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.sound ? LANGUAGE.wd.on : LANGUAGE.wd.off}
          </Text>
          <Switch
            style={styles.setting}
            onValueChange={sound => this.setState({ sound })}
            value={this.state.sound}
          />
        </View>
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.recovery}</Text>
        <Text style={styles.sectionHeader2}>{LANGUAGE.wd.recoveryTime}</Text>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.recoveryTime ? LANGUAGE.wd.on : LANGUAGE.wd.off}
          </Text>
          <Switch
            style={styles.setting}
            onValueChange={recoveryTime => this.setState({ recoveryTime })}
            value={this.state.recoveryTime}
          />
        </View>
        {this.state.recoveryTime && (
          <View style={styles.rowTextSetting}>
            <Text style={styles.textDes}>{LANGUAGE.wd.recoveryTimeDes}</Text>
          </View>
        )}
        <Text style={styles.sectionHeader2}>
          {LANGUAGE.wd.recoveryDistance}
        </Text>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.recoveryDistance ? LANGUAGE.wd.on : LANGUAGE.wd.off}
          </Text>
          <Switch
            style={styles.setting}
            onValueChange={recoveryDistance =>
              this.setState({ recoveryDistance })
            }
            value={this.state.recoveryDistance}
          />
        </View>
        {this.state.recoveryDistance && (
          <View style={styles.rowTextSetting}>
            <Text style={styles.textDes}>
              {LANGUAGE.wd.recoveryDistanceDes}
            </Text>
          </View>
        )}
        <Text style={styles.sectionHeader}>{LANGUAGE.wd.other}</Text>
        {this.props.ownInfo.isFree && (
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>{LANGUAGE.wd.payDes}</Text>
            <Button
              style={styles.button}
              title={LANGUAGE.wd.pay}
              onPress={() => this.buyStore()}
            />
          </View>
        )}
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>{LANGUAGE.wd.initializeDes}</Text>
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

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  setOwnInfo,
  setOwnInfoSetting,
  setOwnInfoCoords,
  clearStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setting);
