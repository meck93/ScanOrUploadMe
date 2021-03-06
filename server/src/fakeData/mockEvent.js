const jsonEvent = {
  kind: 'calendar#event',
  etag: '"3100098759314000"',
  id: 'kt5it5vluuo0mmpq0f84sio858',
  status: 'confirmed',
  htmlLink: 'https://www.google.com/calendar/event?eid=a3Q1aXQ1dmx1dW8wbW1wcTBmODRzaW84NTggbW9yaXR6LmVja0Bt',
  created: '2019-02-13T09:16:19.000Z',
  updated: '2019-02-13T09:16:19.744Z',
  summary: 'Test Event Nr. 2',
  description: "I'm test text 2.",
  location: 'Uppsala, Sweden',
  creator: {
    email: 'moritz.eck@gmail.com',
    displayName: 'Moritz Eck',
    self: true
  },
  organizer: {
    email: 'moritz.eck@gmail.com',
    displayName: 'Moritz Eck',
    self: true
  },
  start: {
    dateTime: '2019-02-13T15:00:00+01:00'
  },
  end: {
    dateTime: '2019-02-13T16:00:00+01:00'
  },
  iCalUID: 'kt5it5vluuo0mmpq0f84sio858@google.com',
  sequence: 0,
  reminders: {
    useDefault: false,
    overrides: [
      {
        method: 'popup',
        minutes: 15
      }
    ]
  }
};

export default jsonEvent;
