import React from "react";
import { View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

class CalendarEvent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.textContainer}>Hi there. I'm plain text!</Text>
      </View>
    );
  }
}

export default withNavigation(CalendarEvent);

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  textContainer: {
    margin: 5,
    padding: 5
  }
});
