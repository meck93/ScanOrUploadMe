import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import CameraScreen from "../screens/CameraScreen";
import CalendarEventScreen from "../screens/CalendarEventScreen";

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

export default createBottomTabNavigator(
  {
    CameraTab: {
      screen: CameraStack,
      navigationOptions: {
        tabBarLabel: "Camera",
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
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
    order: ["CameraTab"],
    animationEnabled: true
  }
);
