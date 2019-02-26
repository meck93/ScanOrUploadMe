function nlpToEvent(nlpObject, ocrResult) {
  let organization, person, summary, location, event;

  // Extract necessary information from NLP response
  // TODO: Support multiple people/organizations/etc
  nlpObject.entities.forEach(entity => {
    if (entity.type === "LOCATION") {
      location = entity.name;
    } else if (entity.type === "PERSON") {
      person = entity.name;
    } else if (entity.type === "EVENT") {
      event = entity.name;
    } else if (entity.type === "ORGANIZATION") {
      organization = entity.name;
    }
  });

  // Create a summary for the event, default is empty string
  if (event !== undefined) {
    summary = event;
    if (organization !== undefined) {
      summary = summary + ", " + organization;
    }
  } else {
    summary = "";
  }

  // Calendar event to be returned
  const calendarEvent = {
    description: ocrResult.text,
    summary: summary,
    location: location,
    startTime: ocrResult.start,
    endTime: ocrResult.end,
    reminders: {
      overrides: [
        {
          method: "popup",
          minutes: 15
        }
      ],
      useDefault: false
    },
    updated: Date.now()
  };

  return calendarEvent;
}

export { nlpToEvent };
