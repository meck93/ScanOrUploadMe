import Enzyme from "enzyme";
import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";

import { PreferencesScreen } from "../../../src/screens/PreferencesScreen";

import React from "react";

// Setup Enzyme Adapter
Enzyme.configure({ adapter: new Adapter() });

jest.useFakeTimers();

describe("PreferencesScreen: Shallow Render Component", () => {
  let wrapper;

  const calendar = { activeCalendarId: 1 };
  const settings = { scanLanguage: "EN" };

  const initialState = {
    calendarEvent: null,
    calendars: [],
    data: [
      { name: "English", value: "EN", id: 1 },
      { name: "Swedish", value: "SE", id: 2 }
    ]
  };

  beforeEach(() => {
    wrapper = shallow(
      <PreferencesScreen calendar={calendar} settings={settings} />,
      { disableLifecycleMethods: true }
    );
  });

  it("renders the component without retrieved calendars", () => {
    const component = wrapper.instance();

    expect(component.state).toEqual(initialState);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders the component with two mocked calendars", () => {
    const component = wrapper.instance();

    const newState = {
      calendarEvent: null,
      calendars: [{ title: "Test-1", id: 1 }, { title: "Test-2", id: 2 }],
      data: [
        { name: "English", value: "EN", id: 1 },
        { name: "Swedish", value: "SE", id: 2 }
      ]
    };

    component.setState({
      calendars: [{ title: "Test-1", id: 1 }, { title: "Test-2", id: 2 }]
    });

    wrapper.update();

    expect(component.state).toEqual(newState);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("calls componentDidMount", async () => {
    const mockGetCalendars = jest
      .fn()
      .mockImplementation(() => [{ title: "Mock-Calendar-1", id: 1 }]);

    const calendars = mockGetCalendars();
    console.log(mockGetCalendars.mock.calls);
    expect(mockGetCalendars).toHaveBeenCalled();

    // TODO: Actually call componentDidMount and its functions to load the mocked calendars from the user's phone
  });
});
