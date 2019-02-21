import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import { _storeData, _retrieveData } from "../helpers/localStorage";

class CalendarEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarEvent: null
    };
  }

  async componentDidMount() {
    try {
      // TODO: decide what and when an event is fetched
      this._findEvent();
    } catch (error) {
      Alert.alert(error);
      console.log({ error });
    }
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
        <Text style={styles.textContainer}>
          Calendar Event JSON: {this.state.calendarEvent}
        </Text>
      </View>
    );
  }

  _findEvent = async () => {
    // TODO: Change which event is fetched maybe using a property passed from the CameraScreen using navigation properties
    _retrieveData("event").then(data => {
      this.setState({ calendarEvent: data });
    });
  };
}

export default withNavigation(CalendarEvent);

const styles = StyleSheet.create({
  textContainer: {
    margin: 5,
    padding: 5
  }
});
