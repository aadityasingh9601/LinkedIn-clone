function convertDateToCron(date) {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1; // JS months are 0-based
  return `${minutes} ${hours} ${day} ${month} *`; // ignore day-of-week
}

export {convertDateToCron}