import extractDate from "./extractDate";

function nlpToEvent(nlpObject) {
  let organization, person, description, location, event;

  // Extract necessary information from NLP response
  // TODO: Support multiple people/organizations/etc
  // TODO: Select the entity with the highest confidence value
  nlpObject.forEach(entity => {
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

  // Create a description for the event
  if (event !== undefined) {
    description = event;

    if (organization !== undefined) {
      description = description + ", " + organization;
    }

    if (person !== undefined) {
      description = description + ", " + person;
    }
  } else {
    // the default description is "EVENT CREATION RESULT"
    description = "EVENT CREATION RESULT";
  }

  // Calendar event to be returned
  return {
    description: description,
    location: location
  };
}

function createCalendarEvent(nlpRepsonse, ocrText) {
  let calendarEvent;

  // transform the OCR output to calendar content
  const summary = ocrText;

  // extract the date information from the OCR result
  const dateInfo = extractDate(ocrText);

  // transform NLP output to calendar content
  const nlpResult = nlpToEvent(nlpRepsonse);

  // create the calendar event that will be returned
  calendarEvent = {
    id: createRandomID(),
    description: nlpResult.description,
    summary: summary,
    location: nlpResult.location,
    startTime: dateInfo.startTime,
    endTime: dateInfo.endTime,
    reminders: {
      overrides: [
        {
          method: "popup",
          minutes: 15
        }
      ],
      useDefault: false
    },
    // TODO: fix wrong time being returned => currently returns UTC time
    updated: new Date()
  };

  return calendarEvent;
}

function createRandomID() {
  // Math.random() should be unique because of its seeding algorithm.
  // Convert it to base 10 (only numbers),
  // and grab the first 11 characters after the decimal.
  return Math.random()
    .toString(10)
    .substr(2, 12);
}

export { createCalendarEvent };
