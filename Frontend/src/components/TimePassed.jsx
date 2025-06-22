import "./TimePassed.css";
import { timeRep } from "../utils/helper";

export default function TimePassed({ timePassed, styles = {} }) {
  const diff = new Date(timePassed) - new Date(); // future time = positive
  const isFuture = diff > 0;
  const { weeks, days, hours, minutes, seconds } = timeRep(Math.abs(diff));

  const timeStr =
    weeks > 0
      ? `${weeks}w `
      : days > 0
      ? `${days}d `
      : hours > 0
      ? `${hours}h `
      : minutes > 0
      ? `${minutes}m`
      : `${seconds}s`;

  return (
    <div className="timePassed" style={styles}>
      {isFuture ? `${timeStr} left` : `${timeStr}`}
    </div>
  );
}
