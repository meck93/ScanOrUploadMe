import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

class CalendarEvent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.textContainer}>
          Imagine that we are going to display a calendar event here! The
          information will come from the image uploaded to Google Cloud.
        </Text>
        <Text style={styles.textContainer}>
          I'm the URL of the Image: {this.props.navigation.getParam("photoUri")}
        </Text>
      </View>
    );
  }
}

export default withNavigation(CalendarEvent);

const styles = StyleSheet.create({
  textContainer: {
    margin: 5,
    padding: 5
  }
});
