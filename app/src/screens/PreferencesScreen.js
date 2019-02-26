import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

class PreferencesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarEvent: null
    };
  }

  render() {
    return (
      <View>
        <Text style={styles.textContainer}>Preferences Screen</Text>
      </View>
    );
  }
}

export default withNavigation(PreferencesScreen);

const styles = StyleSheet.create({
  textContainer: {
    margin: 5,
    padding: 5
  }
});
