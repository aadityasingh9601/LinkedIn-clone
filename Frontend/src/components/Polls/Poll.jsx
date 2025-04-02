import "./Poll.css";
import usePollStore from "../../stores/Poll";
import PollOption from "./PollOption";
import useUserStore from "../../stores/User";
import { useEffect, useState } from "react";
import Button from "../Button.";

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
  console.log(poll);
  const timeRep = (time) => {
    const seconds = Math.floor(time / 1000); //Converting to seconds
    const minutes = Math.floor(seconds / 60); //Converting to minutes
    const hours = Math.floor(minutes / 60); //Converting to hours
    const days = Math.floor(hours / 24); //Converting to days.
    const weeks = Math.floor(days / 7); //Converting to weeks.
    return { seconds, minutes, hours, days, weeks };
  };

  const { seconds, minutes, hours, days, weeks } = timeRep(
    new Date(poll.expiresAt) - new Date()
  );

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
            <i
              class="fa-solid fa-ellipsis"
              onClick={() => setToggle(!toggle)}
              style={{
                position: "absolute",
                top: "0rem",
                right: "0rem",
                fontSize: "1.4rem",
              }}
            ></i>
          )}
        </div>
        {toggle && (
          <div style={{ position: "absolute", right: "0rem", top: "1.5rem" }}>
            <Button btnText="Delete" onClick={() => deletePoll(poll._id)} />
          </div>
        )}
        {currUserId !== poll.createdBy._id &&
          (isFollowed ? (
            <button
              className="followedBtn"
              onClick={() => unfollow(post.createdBy._id)}
            >
              Following
              <i class="fa-solid fa-check" style={{ marginLeft: "0.4rem" }}></i>
            </button>
          ) : (
            <button
              className="followBtn"
              onClick={() => follow(post.createdBy._id)}
            >
              <i className="fa-solid fa-plus"></i>Follow
            </button>
          ))}
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
          {weeks > 0
            ? `${weeks}w `
            : days > 0
            ? `${days}d `
            : hours > 0
            ? `${hours}h `
            : minutes > 0
            ? `${minutes}m`
            : `${seconds}s`}
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
