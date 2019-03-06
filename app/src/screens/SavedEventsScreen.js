import React from "react";
import {
  Text,
  Alert,
  Image,
  FlatList,
  TouchableHighlight,
  View,
  StyleSheet
} from "react-native";
import { withNavigation } from "react-navigation";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setCurrentEvent } from "../actions/eventActions";

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
    this.state = {
      data: [calendarEvent, calendarEvent2, calendarEvent3],
      imageUri: null,
      imageId: null,
      displayImage: false
    };
  }

  render() {
    // check if display image is called with a valid imageUri otherwise display all saved events
    return !this.state.displayImage &&
      (this.state.imageUri !== null || this.state.imageUri !== undefined) ? (
      // check if there exist real events (if not display the dummy events from above)
      <View style={styles.container}>
        <FlatList
          data={
            this.props.events.events.length === 0
              ? this.state.data
              : this.props.events.events
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => this._navigateToEvent(item)}
              onLongPress={() => this._setImageUriAndDisplay(item)}
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
      </View>
    ) : (
      <View style={styles.container}>
        <Text>
          The saved image for calender event: {`${this.state.imageId}`}
        </Text>

        <TouchableHighlight
          onPress={() => this._cancelDisplay()}
          style={styles.imageCancelButton}
        >
          <Image source={{ uri: this.state.imageUri }} style={styles.image} />
        </TouchableHighlight>
      </View>
    );
  }

  _navigateToEvent = event => {
    // set the event as the current event
    this.props.setCurrentEvent(event.id);

    // navigate to the calendarEvent screen
    this.props.navigation.navigate("Calendar");
  };

  _setImageUriAndDisplay = event => {
    if (event.uri) {
      this.setState({
        imageUri: event.uri,
        imageId: event.id,
        displayImage: true
      });
    } else {
      Alert.alert(
        "No Saved Image!",
        "We cannot display the original image since it hasn't been stored."
      );
    }
  };

  _cancelDisplay = () => {
    this.setState({ imageUri: null, imageId: null, displayImage: false });
  };
}

const mapStateToProps = state => {
  const { events } = state;
  return { events };
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
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
    paddingTop: 5
  },
  image: {
    resizeMode: "contain",
    borderRadius: 3,
    width: "100%",
    height: "100%"
  },
  imageCancelButton: {
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    overflow: "hidden"
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
