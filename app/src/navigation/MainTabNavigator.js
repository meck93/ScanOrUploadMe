import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import CameraScreen from '../screens/CameraScreen';

const CameraStack = createStackNavigator({
  Camera: {
    screen: CameraScreen,
    path: '/',
    navigationOptions: {
      title: 'ScanMe!',
    },
  },
});

export default createBottomTabNavigator(
  {
    CameraTab: {
      screen: CameraStack,
      path: '/',
      navigationOptions: {
        tabBarLabel: 'Camera',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: 'lightblue',
      inactiveTintColor: 'gray',
    },
  },
);
