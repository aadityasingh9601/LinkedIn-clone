//Only store those functions in here that are used in multiple files throughout the codebase, store the state specific logic and actions in
//their respective zustand stores only.

const timeRep = (time) => {
  //console.log("inside timeRep in helper.js");
  //console.log(time);
  const seconds = Math.floor(time / 1000); //Converting to seconds
  const minutes = Math.floor(seconds / 60); //Converting to minutes
  const hours = Math.floor(minutes / 60); //Converting to hours
  const days = Math.floor(hours / 24); //Converting to days.
  return { seconds, minutes, hours, days };
};

export { timeRep };
