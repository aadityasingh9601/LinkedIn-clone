function convertDateToCron(date) {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  const minutes = ist.getUTCMinutes();
  const hours = ist.getUTCHours();
  const day = ist.getUTCDate();
  const month = ist.getUTCMonth() + 1;
  return `${minutes} ${hours} ${day} ${month} *`;
}

export {convertDateToCron}