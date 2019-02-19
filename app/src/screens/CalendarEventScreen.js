import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import { _storeData, _retrieveData } from "../helpers/localStorage";

class CalendarEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      summary: "",
      description: "",
      location: "",
      startTime: "",
      endTime: ""
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
          calendar event! info fr image fr Google Cloud.
        </Text>
        <Text style={styles.textContainer}>
          Image URL: {this.props.navigation.getParam("photoUri")}
        </Text>
        <Text style={styles.textContainer}>
          Calendar Event:{" "}
          {"\n" +
            " DESCRIPTION: " +
            this.state.description +
            " SUMMARY: " +
            this.state.summary +
            " START: " +
            this.state.startTime +
            " END: " +
            this.state.endTime}
        </Text>
        <TextInput
          style={{ height: 40 }}
          placeholder={"SUMMARY"}
          value={this.state.summary}
          onChangeText={text => this.setState({ summary: text })}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder={"DESCRIPTION"}
          value={this.state.description}
          onChangeText={text => this.setState({ description: text })}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder={"LOCATION:"}
          value={this.state.location}
          onChangeText={text => this.setState({ location: text })}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder={"START_TIME"}
          value={this.state.startTime}
          onChangeText={text => this.setState({ startTime: text })}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder={"END_TIME"}
          value={this.state.endTime}
          onChangeText={text => this.setState({ endTime: text })}
        />
      </View>
    );
  }

  _findEvent = async () => {
    // TODO: Change which event is fetched maybe using a property passed from the CameraScreen using navigation properties

    // load the data for the event from the local storage
    _retrieveData("event").then(data => {
      // create the initial state
      const event = JSON.parse(data);
      const stateUpdate = {
        id: event.id,
        description: event.description,
        summary: event.summary,
        location: event.location,
        startTime: event.start.dateTime,
        endTime: event.end.dateTime
      };

      // set the initial state
      this.setState(stateUpdate);
    });
  };
}

export default withNavigation(CalendarEventScreen);

const styles = StyleSheet.create({
  textContainer: {
    margin: 5,
    padding: 5
  }
});
