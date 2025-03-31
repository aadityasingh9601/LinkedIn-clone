import "./PollOption.css";

export default function PollOption({ pollOption, voteInPoll, pollId }) {
  console.log(pollOption);
  return (
    <div
      className="pollOption"
      onClick={() => voteInPoll(pollId, pollOption._id)}
    >
      {pollOption?.value.toUpperCase()}
    </div>
  );
}
