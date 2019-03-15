import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Picker,
  Platform,
  Alert,
  TouchableOpacity
} from "react-native";
import { withNavigation } from "react-navigation";
import { Calendar, Permissions } from "expo";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setDefaultCalendar } from "../actions/calendarActions";
import { setDefaultScanLanguage } from "../actions/settingsActions";

export class PreferencesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarEvent: null,
      calendars: [],
      data: [
        { name: "English", value: "EN", id: 1 },
        { name: "Swedish", value: "SE", id: 2 }
      ]
    };
  }

  async componentDidMount() {
    // check the necessary permissions
    this._checkPermissions()
      .then(permission => {
        if (permission) {
          // retrieve all local calendars which are modifiable
          this._findCalendars();
        } else {
          Alert.alert(
            "Permission Error",
            "We could not retrieve the local calendars because we're missing the necessary permissions to access the local calendars."
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
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
        <View style={styles.defaultSettingContainer}>
          <Text style={styles.textContainer}>
            ID of the selected Calendar ID:{" "}
            {this.props.calendar.activeCalendarId}
          </Text>

          <Picker
            style={styles.pickerContainer}
            selectedValue={this.props.calendar.activeCalendarId}
            onValueChange={itemValue =>
              this.props.setDefaultCalendar(itemValue)
            }
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

        <View style={styles.defaultSettingContainer}>
          <Text style={styles.textContainer}>
            Default Scan Language: {this.props.settings.scanLanguage}
          </Text>

          <Picker
            style={styles.pickerContainer}
            selectedValue={this.props.settings.scanLanguage}
            onValueChange={itemValue => {
              this.props.setDefaultScanLanguage(itemValue);
            }}
          >
            <Picker.Item label="English" value={"EN"} />
            <Picker.Item label="Swedish" value={"SE"} />
            <Picker.Item label="German" value={"DE"} />
          </Picker>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { calendar, settings } = state;
  return { calendar, settings };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDefaultCalendar,
      setDefaultScanLanguage
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
  defaultSettingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    padding: 5,
    marginTop: 5,
    width: "100%"
  },
  pickerContainer: {
    height: 50,
    width: 150
  },
  subContainer: {
    margin: 8
  },
  dropDownContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 8
  },
  dropDownText: {
    fontSize: 20,
    margin: 8
  }
});
