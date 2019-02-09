import React from "react";
import { View } from "react-native";
import CalendarEvent from "../components/CalendarEvent";
import { withNavigation } from "react-navigation";

class CalendarEventScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CalendarEvent />
      </View>
    );
  }
}

export default withNavigation(CalendarEventScreen);
