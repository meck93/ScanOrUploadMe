import { shallow, mount } from Enzyme from 'enzyme';

import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

import { SavedEventsScreen } from '../../../src/screens/SavedEventsScreen';

import React from 'react';
import renderer from 'react-test-renderer';
// import Enzyme from "enzyme/build";
// import Adapter from "enzyme-adapter-react-16/build";

let now = new Date();
let start = new Date(now.setHours(now.getHours() + 1)).toString();
let end = new Date(now.setHours(now.getHours() + 2)).toString();

let calendarEvent = {
  description: 'Guava Peeling Party',
  id: 1234,
  picUri: 'https://t2.rbxcdn.com/34e222a0bf98d0a46de65de2ece139eb',
  summary: 'Hi John\nI would like to invite you to my birthday party!\nBest James',
  location: 'Klostergatan, Uppsala, Sweden',
  startTime: start,
  endTime: end,
  reminders: {
    overrides: [{ method: 'popup', minutes: 15 }],
    useDefault: false
  },
  updated: Date()
};

let calendarEvent2 = {
  description: 'Puppy Petting Party',
  id: 5555,
  picUri: 'https://t2.rbxcdn.com/34e222a0bf98d0a46de65de2ece139eb',
  summary: 'Hi John\nI would like to invite you to my Puppy Petting Party!\nBest James',
  location: 'Klostergatan, Uppsala, Sweden',
  startTime: start,
  endTime: end,
  reminders: {
    overrides: [{ method: 'popup', minutes: 15 }],
    useDefault: false
  },
  updated: Date()
};

let calendarEvent3 = {
  description: 'Confetti Party',
  id: 5050,
  picUri: 'https://t2.rbxcdn.com/34e222a0bf98d0a46de65de2ece139eb',
  summary: 'Hi ho, hi,ho \nI would like to invite you to my Puppy Petting Party!\nBest James',
  location: 'Klostergatan, Uppsala, Sweden',
  startTime: start,
  endTime: end,
  reminders: {
    overrides: [{ method: 'popup', minutes: 15 }],
    useDefault: false
  },
  updated: Date()
};

/*
* Before running the tests, go to SavedEventsScreen.js in render():
*  comment out the lines I commented out below, and replace them with : this.props.events.events (like below):
*           data={
                // this.props.events.events.length === 0
                //  ? this.state.data
              //: this.props.events.events
            this.props.events.events
          }
*/
describe('SavedEventsScreen: Tests', () => {
  const noEvents = {
    data: [],
    imageUri: null,
    imageId: null,
    displayImage: false
  };

  const someEvents = {
    data: [calendarEvent, calendarEvent2, calendarEvent3],
    imageUri: 'herehere',
    imageId: 1234,
    displayImage: true
  };

  // Setup Enzyme Adapter
  Enzyme.configure({ adapter: new Adapter() });
  jest.useFakeTimers();

  beforeEach(() => {
    wrapper = shallow(<SavedEventsScreen events={noEvents} />, {
      disableLifecycleMethods: true
    });
  });

  describe('SavedEventsScreen: Shallow Render Component', () => {
    it('Saved events: renders the component without any real events', () => {
      const wrapper = shallow(<SavedEventsScreen events={noEvents} />);
      //{ disableLifecycleMethods: true }
      const component = wrapper.instance();

      const newState = {
        data: null,
        imageUri: null,
        imageId: null,
        displayImage: false
      };
      component.setState({
        data: null
      });
      wrapper.update();

      expect(component.state).toEqual(newState);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Saved events: renders the component with a list of events', () => {
      const wrapper = shallow(<SavedEventsScreen events={noEvents} />);
      const component = wrapper.instance();
      const newState = {
        data: null,
        imageUri: null,
        imageId: null,
        displayImage: false
      };
      component.setState({
        data: [calendarEvent, calendarEvent2, calendarEvent3],
        imageUri: 'herehere',
        imageId: 1234,
        displayImage: true
      });
      wrapper.update();

      expect(component.state).toEqual(someEvents);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
