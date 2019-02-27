import React from "react";
import { Text, View, StyleSheet, Picker, Platform, Alert } from "react-native";
import { withNavigation } from "react-navigation";
import { Calendar, Permissions } from "expo";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setDefaultCalendar } from "../actions/calendarActions";

class PreferencesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarEvent: null,
      calendars: []
    };
  }

  async componentDidMount() {
    // check the necessary permissions
    const permission = this._checkPermissions();

    if (permission) {
      // retrieve all local calendars which are modifiable
      this._findCalendars();
    } else {
      Alert.alert(
        "Permission Error",
        "We could not retrieve the local calendars because we're missing the necessary permissions to access the local calendars."
      );
    }
  }

  _checkPermissions = async () => {
    let permission = false;

    // check the calendar permission
    const calendarResponse = await Permissions.askAsync(Permissions.CALENDAR);
    permission = calendarResponse.status === "granted";

    // check the reminder calendars on ios
    if (Platform.OS === "ios") {
      const reminderResponse = await Permissions.askAsync(
        Permissions.REMINDERS
      );
      permission = reminderResponse.status === "granted";
    }

    return permission;
  };

  _findCalendars = async () => {
    // retrieve all event calendars
    const eventCalendars = await Calendar.getCalendarsAsync("event");

    // on ios, also retrieve all reminder calendars
    const reminderCalendars =
      Platform.OS === "ios" ? await Calendar.getCalendarsAsync("reminder") : [];
    const calendars = [...eventCalendars, ...reminderCalendars];

    // filter out non-modifiable calendars
    const modifiableCalendars = calendars.filter(
      calendar => calendar.allowsModifications
    );

    this.setState({ calendars: modifiableCalendars });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textContainer}>
          This is the Calendar ID of the currently selected Calendar:{" "}
          {this.props.calendar.activeCalendarId}
        </Text>

        <Picker
          style={styles.pickerContainer}
          selectedValue={this.props.calendar.activeCalendarId}
          onValueChange={itemValue => this.props.setDefaultCalendar(itemValue)}
        >
          {this.state.calendars.length ? (
            this.state.calendars.map(calendar => (
              <Picker.Item
                label={calendar.title}
                value={calendar.id}
                key={calendar.id}
              />
            ))
          ) : (
            <Picker.Item
              label="Error: No Permission to access the calendars"
              value={1}
            />
          )}
        </Picker>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { calendar } = state;
  return { calendar };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDefaultCalendar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(PreferencesScreen));

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flexDirection: "column"
  },
  pickerContainer: {
    margin: 5,
    padding: 5,
    height: 50,
    width: 150
  },
  textContainer: {
    margin: 5,
    padding: 5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da"
  }
});
