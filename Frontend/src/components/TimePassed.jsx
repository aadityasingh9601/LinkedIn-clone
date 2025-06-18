import "./TimePassed.css";
import { timeRep } from "../utils/helper";

export default function TimePassed({ timePassed, styles = {} }) {
  const { weeks, days, hours, minutes, seconds } = timeRep(
    new Date() - new Date(timePassed)
  );
  return (
    <div className="timePassed" style={styles}>
      {weeks > 0
        ? `${weeks}w `
        : days > 0
        ? `${days}d `
        : hours > 0
        ? `${hours}h `
        : minutes > 0
        ? `${minutes}m`
        : `${seconds}s`}
    </div>
  );
}
