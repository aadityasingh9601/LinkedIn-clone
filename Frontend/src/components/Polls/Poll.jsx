import styles from "./Poll.module.css";
import usePollStore from "../../stores/Poll";
import PollOption from "./PollOption";
import DeleteModal from "../shared-components/Modal/DeleteModal";
import Modal from "../shared-components/Modal/Modal";
import { useEffect, useState } from "react";
import TimePassed from "../shared-components/Date_Time/TimePassed";
import PostHead from "../Posts/PostHead";
import { toast } from "react-toastify";

export default function Poll({ poll }) {
  const [voted, setVoted] = useState(false);
  const voteInPoll = usePollStore((s) => s.voteInPoll);
  const unVote = usePollStore((s) => s.unVote);
  const deletePoll = usePollStore((s) => s.deletePoll);
  const checkVote = usePollStore((s) => s.checkVote);
  const [deleteModal, setDeleteModal] = useState(false);
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
    <>
      <div className={styles.poll}>
        <PostHead
          data={poll}
          type="poll"
          setEdit={() => {
            return toast.warn("Poll can't be edited!");
          }}
          setDelete={setDeleteModal}
        />

        <div className={styles.pollbody}>
          <div className={styles.ques}>{poll?.question}</div>
          <div className={styles.choices}>
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
          <div className={styles.pollInfo}>
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
                className={styles.undo}
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
      {deleteModal && (
        <Modal>
          <DeleteModal
            handleCancel={setDeleteModal}
            handleDelete={() => {
              deletePoll(poll._id);
            }}
          />
        </Modal>
      )}
    </>
  );
}
