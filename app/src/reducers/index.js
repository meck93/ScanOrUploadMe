import { combineReducers } from "redux";
import settings from "./settingsReducer";
import calendar from "./calendarReducer";
import events from "./eventReducer";

export default combineReducers({
  calendar,
  events,
  settings
});
