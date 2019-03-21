import React from "react";
import {
  Button,
  Text,
  TextInput,
  ScrollView,
  View,
  StyleSheet,
  Alert,
  Linking
} from "react-native";
import { withNavigation } from "react-navigation";
import { Calendar, Notifications } from "expo";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { modifyEvent } from "../actions/eventActions";


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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputItem}
            placeholder={"SUMMARY"}
            value={this.state.summary}
            onChangeText={text => this.setState({ summary: text })}
          />

          <TextInput
            style={styles.inputItem}
            placeholder={"DESCRIPTION"}
            value={this.state.description}
            onChangeText={text => this.setState({ description: text })}
          />

          <TextInput
            style={styles.inputItem}
            placeholder={"LOCATION:"}
            value={this.state.location}
            onChangeText={text => this.setState({ location: text })}
          />

          <TextInput
            style={styles.inputItem}
            placeholder={"START_TIME"}
            value={this.state.startTime}
            onChangeText={text => this.setState({ startTime: text })}
          />

          <TextInput
            style={styles.inputItem}
            placeholder={"END_TIME"}
            value={this.state.endTime}
            onChangeText={text => this.setState({ endTime: text })}
          />
        </View>

        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button onPress={this._addToCalendar} title="Add to Calendar" />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={this._deleteEvent} title="Remove Event" />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={this._updateEventDetails} title="Update Event" />
          </View>
        </View>
        <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button onPress={this._sendByEmail} title="Email To Friend" />
          </View>
          </View>
      </ScrollView>
    );
  }

  _updateEventDetails = () => {
    let oldEvent = this.props.events.currentEvent;

    // update all fields of the event
    oldEvent.description = this.state.description;
    oldEvent.summary = this.state.summary;
    oldEvent.location = this.state.location;
    oldEvent.startTime = this.state.startTime;
    oldEvent.endTime = this.state.endTime;

    // update the currentEvent
    this.props.modifyEvent(oldEvent);
  };
  _sendByEmail = () => {
    const event_title = this.state.description;
    const event_description = this.state.summary;
    Linking.openURL('mailto:?subject= Invitation to: ' + event_title + '&body= ' + event_description)

  };

  _findEvent = () => {
    // retrieve all events from the global store
    const events = this.props.events.events;

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
      const currentEvent = this.props.events.currentEvent;

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

  _addToCalendar = async () => {
    //create empty event
    let eventDetails = {
      title: "",
      startDate: "",
      endDate: "",
      allDay: false,
      location: "",
      notes: "",
      alarms: [
        {
          relativeOffset: -15,
          method: Calendar.AlarmMethod.DEFAULT
        }
      ],
      //this piece of code adds event to every second day after the start date (because of the inteval 2)
      recurrenceRule: {
        frequency: Calendar.Frequency.DAILY,
        interval: 2,
        endDate: "2019-02-22T16:00:00.000Z",
        occurrence: 4
      },
      availability: "busy",
      // TODO: check if the timezone still works on Android
      timeZone: "GMT+1"
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
        body: "Do not forget about your event on " + eventDetails.startDate
      },
      {
        //repeat: 'minute',
        time: new Date().getTime() + 10000
      }
    );
    console.log(notificationId);
    //Notifications.cancelAllScheduledNotificationsAsync()
  };
}

const mapStateToProps = state => {
  const { calendar, events } = state;
  return { calendar, events };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      modifyEvent
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
  inputContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    margin: 5,
    padding: 5
  },
  inputItem: {
    height: 40
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20
  },
  buttonContainer: {
    marginTop: 50,
    marginHorizontal: 5
  }
});
