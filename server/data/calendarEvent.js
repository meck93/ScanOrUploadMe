const calendarEvent = {
  description: '',
  summary: '',
  location: '',
  startTime: Date(),
  endTime: Date(),
  reminders: {
    overrides: [{ method: 'popup', minutes: 15 }],
    useDefault: false
  },
  updated: Date()
};

const visionresult = {
  locations: [],
  description:
    "We're looking for 40 new employees for our it department.\nSearch A service that daily takes more than 800 000 locals\nforward\n",
  locale: 'en',
  confidence: 0
};

const nlpresult = [
  { name: 'service', type: 'OTHER', salience: 0.37266337871551514 },
  { name: 'employees', type: 'PERSON', salience: 0.3311166763305664 },
  { name: 'department', type: 'ORGANIZATION', salience: 0.23197905719280243 },
  { name: 'locals', type: 'PERSON', salience: 0.06424087285995483 }
];
