// chrono time parser
const chrono = require('chrono-node');

// function that uses chrono to extract start and end times, returns description without newlines
export default function extractDate(text) {
  // description as string, remove line breaks
  const desc = text.toString().replace(/(\r\n|\n|\r)/gm, '');

  // parse the string and try to extract the date
  const results = chrono.parse(desc);

  try {
    let startTime;
    let endTime;

    // try to extract a date
    if (results.length) {
      try {
        startTime = results[0].start.date();
        endTime = results[0].end.date();

        return {
          text: desc,
          startTime: startTime,
          endTime: endTime
        };
      } catch (error) {
        // otherwise just return the current date
        let now = new Date();
        // start time to one hour in the future
        startTime = new Date(now.setHours(now.getHours() + 1)).toString();
        // end time two hours in the future
        endTime = new Date(now.setHours(now.getHours() + 2)).toString();
      }
    } else {
      // otherwise just return the current date
      let now = new Date();
      // start time to one hour in the future
      startTime = new Date(now.setHours(now.getHours() + 1)).toString();
      // end time two hours in the future
      endTime = new Date(now.setHours(now.getHours() + 2)).toString();
    }

    return {
      text: desc,
      startTime: startTime,
      endTime: endTime
    };
  } catch (error) {
    console.log(error);
  }
}
