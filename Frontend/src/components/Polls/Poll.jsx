import "./Poll.css";
import usePollStore from "../../stores/Poll";
import PollOption from "./PollOption";

export default function Poll({ poll }) {
  const voteInPoll = usePollStore((state) => state.voteInPoll);
  console.log(poll);
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
          {/* <span style={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.65)" }}>
            {days > 0
              ? `${days}d `
              : hours > 0
              ? `${hours}h `
              : minutes > 0
              ? `${minutes}m`
              : `${seconds}s`}
          </span> */}
        </div>
        {/* {currUserId !== post.createdBy._id &&
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
          ))} */}

        {/* {currUserId === post.createdBy._id && (
          <button className="options" onClick={() => setToggle(!toggle)}>
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        )} */}
      </div>
      <div className="pollbody">
        <div className="ques">{poll?.question}</div>
        <div className="choices">
          {poll?.options.map((pollOption) => {
            return (
              <PollOption
                key={pollOption._id}
                voteInPoll={voteInPoll}
                pollId={poll._id}
                pollOption={pollOption}
              />
            );
          })}
        </div>
        <div className="pollInfo"> {poll.voters.length} votes . 1w left</div>
      </div>
    </div>
  );
}
