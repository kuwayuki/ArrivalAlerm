import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { MapView } from 'expo';
import { connect } from 'react-redux';

export class EditRegist extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // !!! ここでログを確認してみましょう。
    console.log('start');
    console.log(this.props.navigation);
    console.log('end');
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 128,
    width: 128,
  },
});

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(EditRegist);
