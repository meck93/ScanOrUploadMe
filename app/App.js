import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Icon from '@expo/vector-icons';
import * as Font from 'expo-font';

import TabNavigator from './src/navigation/TabNavigator';

// Redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './src/reducers/index';

// global store
const store = createStore(reducers);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false
    };
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png')
      ]),
      Font.loadAsync({
        // tab bar font
        ...Icon.Ionicons.font
      })
    ]);
  };

  _handleLoadingError = error => {
    // can be used to report the error to the error reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <Provider store={store}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <TabNavigator />
          </Provider>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
});
