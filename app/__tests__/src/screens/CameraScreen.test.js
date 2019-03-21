import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";
import { CameraScreen } from "../../../src/screens/CameraScreen";

import React from "react";

import renderer from "react-test-renderer";
import Enzyme from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";

describe("CameraScreen: Tests", () => {
  const noPhoto = {
    calendarEvent: null,
    image: null,
    uploading: false
    /*currentEventId: null,
        currentEvent: null,
        events: [] */
  };

  const dummyPhoto = {
    calendarEvent: 11,
    image: "smth",
    uploading: true
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
  // Setup Enzyme Adapter
  // Enzyme.configure({ adapter: new Adapter() });
  jest.useFakeTimers();

  beforeEach(() => {});

  describe("CameraScreen: Shallow Render Component", () => {
    it("CameraScreen: should render the component without an input photo ", () => {
      const wrapper = shallow(<CameraScreen events={noPhoto} />);
      const component = wrapper.instance();

      expect(component.state).toEqual(noPhoto);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it("CameraScreen: should render the component with a mock input photo", () => {
      const wrapper = shallow(<CameraScreen events={noPhoto} />);
      const component = wrapper.instance();

      const newState = {
        calendarEvent: null,
        image: null,
        uploading: false
      };

      component.setState({
        calendarEvent: 11,
        image: "smth",
        uploading: true
      });

      wrapper.update();

      expect(component.state).toEqual(dummyPhoto);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
