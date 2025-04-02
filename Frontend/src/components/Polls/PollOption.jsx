import { useState } from "react";
import "./PollOption.css";
import usePollStore from "../../stores/Poll";

export default function PollOption({
  pollOption,
  voteInPoll,
  pollId,
  totalVotes,
  voted,
  setVoteState,
}) {
  const progress = Math.floor((pollOption?.votes * 100) / totalVotes);
  return (
    <div
      className={voted ? "pollOption2" : "pollOption"}
      style={voted ? { "--progress-width": `${progress}%` } : {}}
      onClick={() => {
        voteInPoll(pollId, pollOption._id);
        setVoteState(true);
      }}
    >
      <span style={{ zIndex: "10" }} className="poll-text">
        {pollOption?.value.toUpperCase()}
      </span>

      {voted && (
        <span
          style={{ position: "absolute", right: "1rem" }}
          className="poll-percent"
        >
          {progress}%
        </span>
      )}
    </div>
  );
}
