import { combineReducers } from 'redux';

import settings from './settingsReducer';
import calendar from './calendarReducer';
import events from './eventReducer';
import security from './securityReducer';

export default combineReducers({
    calendar,
    events,
    security,
    settings
});
