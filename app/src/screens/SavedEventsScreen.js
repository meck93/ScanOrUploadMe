import React from "react";
import {
  Text,
  FlatList,
  TouchableHighlight,
  View,
  StyleSheet
} from "react-native";
import { withNavigation } from "react-navigation";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setCurrentEvent } from "../actions/calendarActions";

let now = new Date();
let start = new Date(now.setHours(now.getHours() + 1)).toString();
let end = new Date(now.setHours(now.getHours() + 2)).toString();

let calendarEvent = {
  description: "Guava Peeling Party",
  id: 1234,
  picUri: "https://t2.rbxcdn.com/34e222a0bf98d0a46de65de2ece139eb",
  summary:
    "Hi John\nI would like to invite you to my birthday party!\nBest James",
  location: "Klostergatan, Uppsala, Sweden",
  startTime: start,
  endTime: end,
  reminders: {
    overrides: [{ method: "popup", minutes: 15 }],
    useDefault: false
  },
  updated: Date()
};

let calendarEvent2 = {
  description: "Puppy Petting Party",
  id: 5555,
  picUri: "https://t2.rbxcdn.com/34e222a0bf98d0a46de65de2ece139eb",
  summary:
    "Hi John\nI would like to invite you to my Puppy Petting Party!\nBest James",
  location: "Klostergatan, Uppsala, Sweden",
  startTime: start,
  endTime: end,
  reminders: {
    overrides: [{ method: "popup", minutes: 15 }],
    useDefault: false
  },
  updated: Date()
};

let calendarEvent3 = {
  description: "Confetti Party",
  id: 5050,
  picUri: "https://t2.rbxcdn.com/34e222a0bf98d0a46de65de2ece139eb",
  summary:
    "Hi ho, hi,ho \nI would like to invite you to my Puppy Petting Party!\nBest James",
  location: "Klostergatan, Uppsala, Sweden",
  startTime: start,
  endTime: end,
  reminders: {
    overrides: [{ method: "popup", minutes: 15 }],
    useDefault: false
  },
  updated: Date()
};

class SavedEventsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [calendarEvent, calendarEvent2, calendarEvent3] };
  }

  render() {
    return (
      // check if there exist real events (if not display the dummy events from above)
      <View style={styles.container}>
        {this.props.calendar.events.length === 0 ? (
          <FlatList
            data={this.state.data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableHighlight
                onPress={() => this._onPressButton(item)}
                underlayColor="white"
              >
                <View style={styles.flatview}>
                  <Text style={styles.name}>{item.description}</Text>
                  <Text style={styles.brief}>{item.startTime}</Text>
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={item => `${item.id}`}
          />
        ) : (
          <FlatList
            data={this.props.calendar.events}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableHighlight
                onPress={() => this._onPressButton(item)}
                underlayColor="white"
              >
                <View style={styles.flatview}>
                  <Text style={styles.name}>{item.description}</Text>
                  <Text style={styles.brief}>{item.startTime}</Text>
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={item => `${item.id}`}
          />
        )}
      </View>
    );
  }

  _onPressButton = event => {
    // set the event as the current event
    this.props.setCurrentEvent(event.id);

    // navigate to the calendarEvent screen
    this.props.navigation.navigate("Calendar");
  };
}

const mapStateToProps = state => {
  const { calendar } = state;
  return { calendar };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setCurrentEvent
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(SavedEventsScreen));

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 5,
    padding: 20
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    marginTop: 20,
    padding: 20,
    paddingTop: 20
  },
  photo: {
    borderRadius: 20,
    height: 40,
    width: 40
  },
  text: {
    fontSize: 16,
    marginLeft: 12
  },
  h2text: {
    marginTop: 10,
    // Had to comment out the font because we need to first load it in the App.js => otherwise the app dies on android
    // fontFamily: "Helvetica",
    fontSize: 28,
    fontWeight: "bold"
  },
  flatview: {
    justifyContent: "center",
    paddingTop: 30,
    borderRadius: 2
  },
  name: {
    // Had to comment out the font because we need to first load it in the App.js => otherwise the app dies on android
    // fontFamily: "Verdana",
    fontSize: 18
  },
  brief: {
    color: "gray"
  }
});
