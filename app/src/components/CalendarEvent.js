import React from "react";
import { Button, Text, TextInput,  View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import { _storeData, _retrieveData } from "../helpers/localStorage";
import jsonEvent from '../mockEvent';

class CalendarEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cal_id: "kt5it5vluuo0mmpq0f84sio858",
      cal_status: "confirmed",
      cal_created: "2019-02-13T09:16:19.000Z",
      cal_updated: "2019-02-13T09:16:19.744Z",
      cal_summary: "Test Event Nr. 2",
      cal_description: "Im test text 2.",
      cal_location: "Uppsala, Sweden",
      cal_start:  "2019-02-13T15:00:00+01:00",
      cal_end:  "2019-02-13T16:00:00+01:00",
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

  //multiplyES6 = (x, y) => { return (x * y);};

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
          Calendar Event: {'\n'+' DESCRIPTION: '+this.state.cal_description + ' SUMMARY: '+this.state.cal_summary +
        ' START: '+ this.state.cal_start + ' END: ' + this.state.cal_end}
        </Text>
          <TextInput
              style={{height: 40}}
              placeholder={'SUMMARY: '+this.state.cal_summary}
              //value={jsonEvent.id}
              onChangeText={(text) => this.setState({cal_summary:text})}
          />
          <TextInput
              style={{height: 40}}
              placeholder={'DESCRIPTION: '+ this.state.cal_description}
              //value={jsonEvent.id}
              onChangeText={(text) => this.setState({cal_description:text})}
          />
          <TextInput
              style={{height: 40}}
              placeholder={'LOCATION: '+ this.state.cal_location}
              //value={jsonEvent.id}
              onChangeText={(text) => this.setState({cal_location:text})}
          />
          <TextInput
              style={{height: 40}}
              placeholder={'START: '+this.state.cal_start}
              //value={jsonEvent.id}
              onChangeText={(text) => this.setState({cal_start:text})}
          />
          <TextInput
              style={{height: 40}}
              placeholder={'END: ' +this.state.cal_end}
              //value={jsonEvent.id}
              onChangeText={(text) => this.setState({cal_end:text})}
          />
        </View>
    );
  }

  onClick = () => {
    this.setState({
      calendarEvent: 1
    });

    this.setState({
      message: `click-state ${this.state.value}`
    });
  }


  parse_this_JSON = () => {
    if (this.state.calendarEvent){
    console.log("*****************");
    //console.log(out.htmlLink);
    console.log("initial:"+this.state.calendarEvent);
    const out = JSON.parse(this.state.calendarEvent);
    debugger;
    console.log('out.id = '+out.id);
    //console.log(out());
    //console.log(json_content['id']);
    //console.log("*****************");
    //console.log(out.summary);
    return (out);
    }
  }

  _findEvent = async () => {
    // TODO: Change which event is fetched maybe using a property passed from the CameraScreen using navigation properties
    const event = await _retrieveData("event");
    this.setState({ calendarEvent: event });
  };
}

export default withNavigation(CalendarEvent);

const styles = StyleSheet.create({
  textContainer: {
    margin: 5,
    padding: 5
  }
});
