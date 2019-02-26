// chrono time parser
const chrono = require("chrono-node");

// function that uses chrono to extract start and end times, returns description without newlines
export default function mrChrono(text) {
  // description as string, remove line breaks
  const desc = text.toString().replace(/(\r\n|\n|\r)/gm, "");

  const results = chrono.parse(desc);
  const startTime = results[0].start.date();
  const endTime = results[0].end.date();

  // return description without newline, start and end time
  return {
    text: desc,
    start: startTime,
    end: endTime
  };
}
