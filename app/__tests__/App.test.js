import "react-native";
import React from "react";
import App from "../App";
import renderer from "react-test-renderer";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";

describe("App Snapshot", () => {
  jest.useFakeTimers();

  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it("Renders the loading screen", async () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Renders the root without loading screen", async () => {
    const tree = renderer.create(<App skipLoadingScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("two plus two is four", () => {
    expect(2 + 2).toBe(4);
  });

  it("works", () => {
    expect(1).toBe(1);
  });
});
