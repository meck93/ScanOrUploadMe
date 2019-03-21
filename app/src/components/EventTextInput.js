import React from "react";
import { TextInput } from "react-native";

export default class EventTextInput extends React.Component {
  // Component's constructor
  constructor(props) {
    // Required to call original constructor
    super(props);
  }

  render() {
    return (
      <TextInput
        style={this.props.style}
        multiline={this.props.multiline}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChangeText={this.props.onChangeText}
      />
    );
  }
}
