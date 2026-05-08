import styles from "./PollOption.module.css";

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
      className={voted ? styles.pollOption2 : styles.pollOption}
      style={voted ? { "--progress-width": `${progress}%` } : {}}
      onClick={() => {
        voteInPoll(pollId, pollOption._id);
        setVoteState(true);
      }}
    >
      <span style={{ zIndex: "10" }} className={styles["poll-text"]}>
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
