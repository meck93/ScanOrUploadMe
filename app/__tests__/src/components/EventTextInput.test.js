import { shallow, mount } from "enzyme";

import EventTextInput from "../../../src/components/EventTextInput";

import React from "react";
import { TextInput } from "react-native";

import renderer from "react-test-renderer";

describe("EventTextInput: Test", () => {
  it("test the EventTextInput rendering", () => {
    const mockUpdateFunction = jest
      .fn()
      .mockImplementation(() => "Value-Changed");

    const instanceOf = renderer
      .create(
        <EventTextInput
          multiline={true}
          placeholder={"Placeholder-Test"}
          value={"Value-Test"}
          onChangeText={text => mockUpdateFunction()}
        />
      )
      .getInstance();
  });

  it("test the EventTextInput onChangeFunction", () => {
    const mockUpdateFunction = jest
      .fn()
      .mockImplementation(() => "Value-Changed");

    const wrapper = mount(
      <EventTextInput
        multiline={true}
        placeholder={"Placeholder-Test"}
        value={"Value-Test"}
        onChangeText={mockUpdateFunction}
      />
    );

    expect(wrapper.find(EventTextInput)).toExist();
    expect(wrapper.find(TextInput)).toExist();

    const input = wrapper.find(TextInput);
    input.props().onChangeText();

    expect(mockUpdateFunction.mock.results[0].value).toEqual("Value-Changed");
  });
});
