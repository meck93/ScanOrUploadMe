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
import SavedEventScreen from "../screens/SavedEventsScreen";

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

const SavedStack = createStackNavigator(
  {
    Saved: {
      screen: SavedEventScreen,
      navigationOptions: {
        title: "Created Events"
      }
    }
  },
  {
    initialRouteName: "Saved"
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
    },
    SavedTab: {
      screen: SavedStack,
      navigationOptions: {
        tabBarLabel: "Saved",
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-link" : "md-link"}
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
    order: ["CameraTab", "SavedStack", "PreferencesTab"],
    animationEnabled: true
  }
);
