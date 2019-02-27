import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import CameraScreen from "../screens/CameraScreen";
import CalendarEventScreen from "../screens/CalendarEventScreen";
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

const SavedStack = createStackNavigator({
    Saved: SavedEventScreen,
});

SavedStack.navigationOptions = {
    tabBarLabel: 'Saved',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
    focused={focused}
    name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
/>
),
};

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
    SavedStack,
  },
  {
    tabBarOptions: {
      activeTintColor: "lightblue",
      inactiveTintColor: "gray"
    },
    order: ["CameraTab","SavedStack"],
    animationEnabled: true
  }
);
