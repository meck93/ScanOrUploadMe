import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";

import { CalendarEventScreen } from "../../../src/screens/CalendarEventScreen";

import React from "react";

import renderer from "react-test-renderer";

describe("CalendarEventScreen: Tests", () => {
  const initialEvents = {
    currentEventId: null,
    currentEvent: null,
    events: []
  };

  const someEvents = {
    currentEventId: 1,
    currentEvent: {
      id: 1,
      description: "Test",
      summary: "Test",
      location: "Test",
      startTime: "Test",
      endTime: "Test"
    },
    events: [
      {
        id: 1,
        description: "Test",
        summary: "Test",
        location: "Test",
        startTime: "Test",
        endTime: "Test"
      }
    ]
  };

  const dummyState = {
    id: 12312312,
    description: "DummyTitle",
    summary: "DummyText",
    location: "DummyLocation",
    startTime: "2019-02-27T16:00:00.000Z",
    endTime: "2019-02-27T18:00:00.000Z"
  };

  const initializedState = {
    id: 1,
    description: "Test",
    summary: "Test",
    location: "Test",
    startTime: "Test",
    endTime: "Test"
  };

  jest.useFakeTimers();

  beforeEach(() => {});

  describe("CalendarEventScreen: Shallow Render Component", () => {
    it("renders the component without any real events", () => {
      const wrapper = shallow(<CalendarEventScreen events={initialEvents} />);
      const component = wrapper.instance();

      expect(component.state).toEqual(dummyState);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it("renders the component with a real event", () => {
      const wrapper = shallow(<CalendarEventScreen events={someEvents} />);
      const component = wrapper.instance();

      expect(component.state).toEqual(initializedState);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe("test TextInput changes", () => {
    it("test the _updateSingleStateValue function", () => {
      const instanceOf = renderer
        .create(<CalendarEventScreen events={initialEvents} />, {
          disableLifecycleMethods: true
        })
        .getInstance();

      // call the state update method
      instanceOf._updateSingleStateValue("description", "TEST_TEST");

      // check that the update value is correct
      expect(instanceOf.state.description).toEqual("TEST_TEST");
    });
  });
});
