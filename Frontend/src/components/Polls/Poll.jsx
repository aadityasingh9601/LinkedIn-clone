import "./Poll.css";
import usePollStore from "../../stores/Poll";
import PollOption from "./PollOption";
import useUserStore from "../../stores/User";
import { useEffect, useState } from "react";
import Button from "../Button.";
import Ellipsis from "../../icons/Ellipsis";
import TimePassed from "../TimePassed";
import User from "../User";
import PostHead from "../Posts/PostHead";

export default function Poll({ poll }) {
  const [voted, setVoted] = useState(false);
  const currUserId = useUserStore((state) => state.currUserId);
  const voteInPoll = usePollStore((state) => state.voteInPoll);
  const unVote = usePollStore((state) => state.unVote);
  const deletePoll = usePollStore((state) => state.deletePoll);
  const checkVote = usePollStore((state) => state.checkVote);
  const [toggle, setToggle] = useState(false);
  const setVoteState = (value) => {
    setVoted(value);
  };

  useEffect(() => {
    async function checkVoteStatus() {
      let voteStatus = await checkVote(poll._id);
      if (voteStatus) {
        setVoteState(true);
      }
    }
    checkVoteStatus();
  }, []);
  return (
    <div className="poll">
      <PostHead data={poll} type="poll" />

      <div className="pollbody">
        <div className="ques">{poll?.question}</div>
        <div className="choices">
          {poll?.options?.map((pollOption) => {
            return (
              <PollOption
                key={pollOption._id}
                voteInPoll={voteInPoll}
                pollId={poll._id}
                pollOption={pollOption}
                voted={voted}
                setVoteState={setVoteState}
                totalVotes={poll.voters.length}
              />
            );
          })}
        </div>
        <div className="pollInfo">
          {" "}
          {poll.voters.length} votes .
          <TimePassed
            timePassed={poll.expiresAt}
            styles={{
              position: "absolute",
              top: "0.1rem",
              left: "3.3rem",
              fontSize: "0.8rem",
            }}
          />
          {voted && (
            <span
              className="undo"
              onClick={() => {
                unVote(poll._id);
                setVoted(false);
              }}
            >
              Undo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
