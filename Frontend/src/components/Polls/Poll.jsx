import "./Poll.css";
import usePollStore from "../../stores/Poll";
import PollOption from "./PollOption";
import useUserStore from "../../stores/User";
import { useEffect, useState } from "react";
import Button from "../Button.";
import Ellipsis from "../../icons/Ellipsis";
import TimePassed from "../TimePassed";

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
      <div className="header">
        <div className="img">
          <img src={poll?.createdBy.profile.profileImage.url} alt="" />
        </div>
        <div className="headline">
          <span>
            <b>{poll?.createdBy.profile.name}</b>
          </span>
          <br />
          <span style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)" }}>
            {poll?.createdBy.profile.headline}
          </span>
          <br />
        </div>
        <div>
          {currUserId === poll.createdBy._id && (
            <Ellipsis
              onClick={() => setToggle(!toggle)}
              style={{
                position: "absolute",
                top: "0rem",
                right: "0rem",
                fontSize: "1.4rem",
              }}
            />
          )}
        </div>
        {toggle && (
          <div style={{ position: "absolute", right: "0rem", top: "1.5rem" }}>
            <Button btnText="Delete" onClick={() => deletePoll(poll._id)} />
          </div>
        )}
      </div>
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
          <TimePassed timePassed={poll.expiresAt} />
          left.{" "}
          {voted && (
            <span
              style={{ color: "#0a66c2", fontWeight: "500", cursor: "pointer" }}
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
