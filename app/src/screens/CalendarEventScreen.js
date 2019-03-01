import React from "react";
import { Button, Text, TextInput, View, StyleSheet, Alert, AsyncStorage } from "react-native";
import { withNavigation } from "react-navigation";
import { Calendar, Permissions } from "expo";
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
      // get event name from navigation prop (passed from camera screen)
      const createdEventName = this.props.navigation.getParam("eventName");

      // TODO: decide what and when an event is fetched
      this._findEvent(createdEventName);
    } catch (error) {
      Alert.alert(error);
      console.log({ error });
    }
  }

  render() {
    return (
      <View>
        <Text style={styles.textContainer}>
          Image URL: {this.props.navigation.getParam("photoUri")}
        </Text>

        <Text style={styles.textContainer}>
          CALENDAR EVENT {" "}
          {"\n" + " SUMMARY: " }
        </Text>

        <TextInput
          style={{ height: 40 }}
          placeholder={"SUMMARY"}
          value={this.state.summary}
          onChangeText={text => this.setState({ summary: text })}
        />
        <Text style={styles.textContainer}>
        {" DESCRIPTION: " }
        </Text>
        <TextInput
          style={{ height: 40 }}
          placeholder={"DESCRIPTION"}
          value={this.state.description}
          onChangeText={text => this.setState({ description: text })}
        />

        <Text style={styles.textContainer}>
        {" LOCATION: " }
        </Text>
        <TextInput
          style={{ height: 40 }}
          placeholder={"LOCATION:"}
          value={this.state.location}
          onChangeText={text => this.setState({ location: text })}
        />

        <Text style={styles.textContainer}>
        {"STARTS AT: " }
        </Text>
        <TextInput
          style={{ height: 40 }}
          placeholder={"START_TIME"}
          value={this.state.startTime}
          onChangeText={text => this.setState({ startTime: text })}
        />

        <Text style={styles.textContainer}>
        {"ENDS AT: " }
        </Text>
        <TextInput
          style={{ height: 40 }}
          placeholder={"END_TIME"}
          value={this.state.endTime}
          onChangeText={text => this.setState({ endTime: text })}
        />

        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button onPress={this._addToCalendar} title="Add to Calendar" />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={this._deleteEvent} title="Remove Event" />
          </View>
        <View style={styles.buttonContainer}>
        <Button onPress={this._saveEvent} title="Save" />
        </View>
        </View>
      </View>
    );
  }

  _findEvent = async eventName => {
    // TODO: Change which event is fetched maybe using a property passed from the CameraScreen using navigation properties

    // load the data for the event from the local storage
    _retrieveData(eventName).then(data => {
      // create the initial state
      const event = JSON.parse(data);
      const stateUpdate = {
        id: event.id,
        description: event.description,
        summary: event.summary,
        location: event.location,
        startTime: event.startTime,
        endTime: event.endTime
      };

      // set the initial state
      this.setState(stateUpdate);
    });
  };

  // TODO: Make it work on Android as well
  _deleteEvent = async () => {
    try {
      if (this.state.eventId) {
        const id = this.state.eventId;

        // TODO: Fix - Event is not deleted!
        await Calendar.deleteEventAsync(`${id}`, {
          instanceStartDate: "2019-02-19T15:00:00.000Z",
          futureEvents: true
        });

        this.setState({ eventId: null });
        Alert.alert(`Event with ID: ${id} has been deleted.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  _saveEvent = async () => {
    const userId = '8ba790f3-5acd-4a08-bc6a-97a36c124f29';
    /*const saveUserId = async userId => {
      try {
        await AsyncStorage.setItem('userId', userId);
        console.log('*****************Success!*****************');
      } catch (error) {
        // Error retrieving data
        console.log(error.message);
      }
    };*/
    /*try {
      await AsyncStorage.setItem('userId', JSON.stringify(userId));
      console.log('*****************Success!*****************');
    } catch (error) {
      // Error saving data
      console.log({ error });
      console.error(error);
    }*/
    //create dummy event
    let eventDetails = {
      title: "I am your new event", //
      startDate: "2019-02-19T15:00:00.000Z", ///this.state.start, //got error saying saying it expected date to end in Z so edited: "2019-02-19T15:00:00.000Z+01:00",
      endDate: "2019-02-19T16:00:00.000Z",
      allDay: false,
      location: this.state.location,
      notes: "Testing add to Calendar",
      alarms: [
        {
          relativeOffset: -15,
          method: Calendar.AlarmMethod.DEFAULT
        }
      ],
      recurrenceRule: {
        frequency: Calendar.Frequency.DAILY,
        interval: 2,
        endDate: "2019-02-22T16:00:00.000Z",
        occurrence: 4
      },
      availability: "busy",
      // TODO: check if the timezone still works on Android
      timeZone: "GMT+1",
      url: "http://www..."
    };

    try {
      if (this.state.startTime) {
        eventDetails.title = this.state.description;
        eventDetails.location = this.state.location;
        eventDetails.startDate = new Date(this.state.startTime);
        eventDetails.endDate = new Date(this.state.endTime);
        eventDetails.recurrenceRule.endDate = new Date(this.state.endTime);
        eventDetails.notes = this.state.summary;
      }
      //add event to default calendar
      /*const eventId = await Calendar.createEventAsync(
          Calendar.DEFAULT,
          eventDetails
      );*/
      try {
        //TODO: generate a proper key not, just 'userId' all the time
        await AsyncStorage.setItem('userId', JSON.stringify(eventDetails));
        console.log('*****************Success!*****************');
      } catch (error) {
        // Error saving data
        console.log({ error });
        console.error(error);
      }
      //if (this.state.eventId) {
       // const id = this.state.eventId;}
      //this.setState({ eventId: eventId });
      //console.log("Event Id", eventId);

      Alert.alert(`The ${eventDetails.title} was saved to this app!`);
    } catch (error) {
      console.log("Error", error);
    }
  };

  _addToCalendar = async () => {
    //create dummy event
    let eventDetails = {
      title: "I am your new event", //
      startDate: "2019-02-19T15:00:00.000Z", ///this.state.start, //got error saying saying it expected date to end in Z so edited: "2019-02-19T15:00:00.000Z+01:00",
      endDate: "2019-02-19T16:00:00.000Z",
      allDay: false,
      location: this.state.location,
      notes: "Testing add to Calendar",
      alarms: [
        {
          relativeOffset: -15,
          method: Calendar.AlarmMethod.DEFAULT
        }
      ],
      recurrenceRule: {
        frequency: Calendar.Frequency.DAILY,
        interval: 2,
        endDate: "2019-02-22T16:00:00.000Z",
        occurrence: 4
      },
      availability: "busy",
      // TODO: check if the timezone still works on Android
      timeZone: "GMT+1",
      url: "http://www..."
    };

    try {
      if (this.state.startTime) {
        eventDetails.title = this.state.description;
        eventDetails.location = this.state.location;
        eventDetails.startDate = new Date(this.state.startTime);
        eventDetails.endDate = new Date(this.state.endTime);
        eventDetails.recurrenceRule.endDate = new Date(this.state.endTime);
        eventDetails.notes = this.state.summary;
      }
      //add event to default calendar
      const eventId = await Calendar.createEventAsync(
        Calendar.DEFAULT,
        eventDetails
      );

      this.setState({ eventId: eventId });
      console.log("Event Id", eventId);

      Alert.alert(`The event ${eventId} is added to your calendar!`);
    } catch (error) {
      console.log("Error", error);
    }
  };
}

export default withNavigation(CalendarEventScreen);

const styles = StyleSheet.create({
  textContainer: {
    margin: 5,
    padding: 5
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20
  },
  buttonContainer: {
    marginTop:50,
    marginHorizontal: 5
  }
});
