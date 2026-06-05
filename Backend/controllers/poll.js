import Poll from "../models/Poll.js";
import { PollDataSchema } from "../zodSchema/index.js";

const createPoll = async (req, res) => {
  const { pollData } = req.body;
  let { pollDuration } = pollData;

  const result = PollDataSchema.safeParse(pollData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  const expiryDate = new Date(
    Date.now() + pollDuration * 24 * 60 * 60 * 1000,
  ).toISOString();

  const newPoll = new Poll({
    question: pollData.question,
    options: pollData.options,
    author: req.user._id,
    expiresAt: expiryDate,
    voters: [],
  });

  await newPoll.save();

  let fullPoll = await Poll.findById(newPoll._id).populate({
    path: "author",
    select: "profile",
    populate: {
      path: "profile",
      select: "name profileImage headline",
    },
  });

  res.status(201).send(fullPoll);
};

const getAllPolls = async (req, res) => {
  const polls = await Poll.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "profile",
      populate: {
        path: "profile", 
        select: "headline name profileImage",
      },
    });
  res.status(200).send(polls);
};

const voteInPoll = async (req, res) => {
  const { id, optionId } = req.params;
  let userId = req.user._id.toString();
  const poll = await Poll.findById(id);

  const newVoter = {
    user: req.user._id,
    optionId: optionId,
  };

  let existingVoter = poll.voters.find(
    (voter) => voter.user.toString() === userId,
  );

  if (existingVoter) {
    return res.status(400).send("You can't vote twice on the same poll");
  }

  let chosenOption = poll.options.find(
    (opt) => opt._id.toString() === optionId,
  );

  poll.voters.push(newVoter);
  chosenOption.votes += 1;
  await poll.save();
  return res.status(200).send(poll);
};

const unVote = async (req, res) => {
  const { id } = req.params;
  let userId = req.user._id.toString();
  const poll = await Poll.findById(id);
  let existingVoter = poll.voters.find(
    (voter) => voter.user.toString() === userId,
  );

  if (!existingVoter) {
    return res.status(400).send("You haven't voted yet!");
  }

  let chosenOption = poll.options.find(
    (opt) => opt._id.toString() === existingVoter.optionId.toString(),
  );

  poll.voters.pull(existingVoter);
  chosenOption.votes -= 1;
  await poll.save();
  return res.status(200).send(poll);
};

const checkVote = async (req, res) => {
  const { id } = req.params;
  const poll = await Poll.findById(id);
  const existingVote = poll.voters.find(
    (voter) => voter.user.toString() === req.user._id.toString(),
  );

  if (existingVote) {
    res.send("Yes");
  } else {
    res.send("No");
  }
};

const deletePoll = async (req, res) => {
  const { id } = req.params;
  const poll = await Poll.findById(id);
  if (req.user._id.toString() === poll.author._id.toString()) {
    await poll.deleteOne();
    return res.status(200).send("Poll deleted successfully!");
  }
};

export default {
  createPoll,
  getAllPolls,
  voteInPoll,
  unVote,
  checkVote,
  deletePoll,
};
