import React from "react";
import {
  Button,
  Text,
  TextInput,
  ScrollView,
  View,
  StyleSheet,
  Alert
} from "react-native";
import { withNavigation } from "react-navigation";
import { Calendar } from "expo";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addEvent, setCurrentEvent } from "../actions/calendarActions";

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

  componentDidMount() {
    try {
      // get event name from global state using redux
      this._findEvent();
    } catch (error) {
      Alert.alert(error);
      console.log({ error });
    }
  }

  render() {
    return (
      <ScrollView>
        <Text style={styles.textContainer}>
          CalendarId: {this.props.calendar.activeCalendarId}
        </Text>

        <Text style={styles.textContainer}>
          All Events:
          {this.props.calendar.events.map(event => (
            <Text key={event.id} style={styles.textContainer}>
              Event: {JSON.stringify(event.id)} - Description:{" "}
              {JSON.stringify(event.description)}
            </Text>
          ))}
        </Text>

        <Text style={styles.textContainer}>
          Current Event:
          {JSON.stringify(this.props.calendar.currentEvent.description)}
        </Text>

        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            {this.props.calendar.events.map(event => (
              <Button
                key={event.id}
                title={`Set current event to: ${event.id}`}
                onPress={() => this.props.setCurrentEvent(event.id)}
              />
            ))}
          </View>
        </View>

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
      </ScrollView>
    );
  }

  _findEvent = () => {
    // retrieve all events from the global store
    const events = this.props.calendar.events;
    console.log("Events Retrieved from Global State:", events);

    if (events.length === 0) {
      const newState = {
        id: 12312312,
        description: "DummyTitle",
        summary: "DummyText",
        location: "DummyLocation",
        startTime: "2019-02-27T16:00:00.000Z",
        endTime: "2019-02-27T18:00:00.000Z"
      };

      this.setState(newState);
    } else {
      // retrieve the current event
      const currentEvent = this.props.calendar.currentEvent;

      const stateUpdate = {
        id: currentEvent.id,
        description: currentEvent.description,
        summary: currentEvent.summary,
        location: currentEvent.location,
        startTime: currentEvent.startTime,
        endTime: currentEvent.endTime
      };

      this.setState(stateUpdate);
    }
  };

  // TODO: Make it work on Android as well
  _deleteEvent = async () => {
    try {
      if (this.state.eventCreationId) {
        const id = this.state.eventCreationId;

        // TODO: Fix - Event is not deleted!
        await Calendar.deleteEventAsync(`${id}`, {
          instanceStartDate: "2019-02-19T15:00:00.000Z",
          futureEvents: true
        });

        this.setState({ eventCreationId: null });
        Alert.alert(`Event with ID: ${id} has been deleted.`);
      } else {
        console.log("No evenCreationId");
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
      title: "I am your new event",
      startDate: "2019-02-27T15:00:00.000Z", ///this.state.start, //got error saying saying it expected date to end in Z so edited: "2019-02-19T15:00:00.000Z+01:00",
      endDate: "2019-02-27T16:00:00.000Z",
      allDay: false,
      location: this.state.location,
      notes: "Testing add to Calendar",
      alarms: [
        {
          relativeOffset: -15,
          method: Calendar.AlarmMethod.DEFAULT
        }
      ],
        //this piece of code adds event to every second day after the start date(because of the inteval 2)
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
      const eventCreationId = await Calendar.createEventAsync(
        // uses the calendarId from redux global store
        // this is the calendarId that is set in the preferences tab
        this.props.calendar.activeCalendarId,

        // the event content
        eventDetails
      );

      this.setState({ eventCreationId: eventCreationId });
      console.log("Event Id", eventCreationId);

      Alert.alert(`The event ${eventCreationId} is added to your calendar!`);
    } catch (error) {
      console.log("Error", error);
    }

    let notificationId = Notifications.scheduleLocalNotificationAsync(
    {
      title: eventDetails.title,
      body: 'Do not forget about your event on ' +eventDetails.startDate,
    },
    {
      //repeat: 'minute',
      time: new Date().getTime() + 10000,
    },
  );
  console.log(notificationId);
  //Notifications.cancelAllScheduledNotificationsAsync()
  };
}

const mapStateToProps = state => {
  const { calendar } = state;
  return { calendar };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addEvent,
      setCurrentEvent
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(CalendarEventScreen));

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
