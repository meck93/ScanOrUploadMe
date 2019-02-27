import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";

import CameraScreen from "../screens/CameraScreen";
import CalendarEventScreen from "../screens/CalendarEventScreen";
import PreferencesScreen from "../screens/PreferencesScreen";

const CameraStack = createStackNavigator(
  {
    Camera: {
      screen: CameraScreen,
      navigationOptions: {
        title: "ScanMe!"
      }
    },
    Calendar: {
      screen: CalendarEventScreen,
      navigationOptions: {
        title: "The created calendar event!"
      }
    }
  },
  {
    initialRouteName: "Camera"
  }
);

const PreferencesStack = createStackNavigator(
  {
    Preferences: {
      screen: PreferencesScreen,
      navigationOptions: {
        title: "Settings"
      }
    }
  },
  {
    initialRouteName: "Preferences"
  }
);

export default createBottomTabNavigator(
  {
    CameraTab: {
      screen: CameraStack,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-home" : "md-home"}
          />
        )
      }
    },
    PreferencesTab: {
      screen: PreferencesStack,
      navigationOptions: {
        tabBarLabel: "Settings",
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}
          />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "lightblue",
      inactiveTintColor: "gray"
    },
    order: ["CameraTab", "PreferencesTab"],
    animationEnabled: true
  }
);
