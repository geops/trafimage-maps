const getDelayString = (milliseconds, isArrival) => {
  let timeInMs = milliseconds;
  if (timeInMs < 0) {
    timeInMs = 0;
  }
  const h = Math.floor(timeInMs / 3600000);
  const m = (isArrival ? Math.ceil : Math.floor)((timeInMs % 3600000) / 60000);

  if (h === 0 && m === 0) {
    return "+0m";
  }
  if (h === 0) {
    return `+${m}m`;
  }

  let str = `+`;
  if (h > 0) {
    str += `${h}h`;
  }

  if (m > 0) {
    str += `${m}m`;
  }
  return str;
};

export default getDelayString;
