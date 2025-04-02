import Poll from "../models/Poll.js";

const createPoll = async (req, res) => {
  const { pollData } = req.body;
  //console.log(pollData);
  let { pollDuration } = pollData;

  const expiryDate = new Date(
    Date.now() + pollDuration * 24 * 60 * 60 * 1000
  ).toISOString();
  console.log(expiryDate);

  const newPoll = new Poll({
    question: pollData.question,
    options: pollData.options,
    createdBy: req.user._id,
    expiresAt: expiryDate,
    voters: [],
  });

  await newPoll.save();

  let fullPoll = await Poll.findById(newPoll._id).populate({
    path: "createdBy",
    select: "profile",
    populate: {
      path: "profile",
      select: "name profileImage headline",
    },
  });

  res.status(201).send(fullPoll);
};

const getPoll = async (req, res) => {
  console.log(req.params);
  res.send("Inside getPoll function");
};

const getAllPolls = async (req, res) => {
  console.log("inside getAllPolls");
  const polls = await Poll.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "createdBy",
      select: "profile", // Include only the `profile` field in `createdBy`
      populate: {
        path: "profile", // Populate the `profile` field
        select: "headline name profileImage", // Include only `headline` and `name` fields in the `profile`
      },
    });
  console.log(polls);
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

  //Check if the user has already voted or not.
  let existingVoter = poll.voters.find(
    (voter) => voter.user.toString() === userId
  );

  if (existingVoter) {
    return res.status(400).send("You can't vote twice on the same poll");
  }

  let chosenOption = poll.options.find(
    (opt) => opt._id.toString() === optionId
  );

  poll.voters.push(newVoter);
  chosenOption.votes += 1;
  await poll.save();
  return res.status(200).send(poll);
};

const unVote = async (req, res) => {
  console.log("inside unvote on teh backend");
  const { id } = req.params;
  let userId = req.user._id.toString();
  const poll = await Poll.findById(id);

  //Check if the user has even voted or not.
  let existingVoter = poll.voters.find(
    (voter) => voter.user.toString() === userId
  );

  if (!existingVoter) {
    return res.status(400).send("You haven't voted yet!");
  }

  let chosenOption = poll.options.find(
    (opt) => opt._id.toString() === existingVoter.optionId.toString()
  );

  poll.voters.pull(existingVoter);
  chosenOption.votes -= 1;
  await poll.save();
  return res.status(200).send(poll);
};

const checkVote = async (req, res) => {
  console.log("inside checkvote on the backend");
  const { id } = req.params;
  console.log(id);

  const poll = await Poll.findById(id);

  const existingVote = poll.voters.find(
    (voter) => voter.user.toString() === req.user._id.toString()
  );

  if (existingVote) {
    res.send("Yes");
  } else {
    res.send("No");
  }
};

const deletePoll = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const poll = await Poll.findById(id);
  if (req.user._id.toString() === poll.createdBy._id.toString()) {
    await poll.deleteOne();
    return res.status(200).send("Poll deleted successfully!");
  }
};

export default {
  createPoll,
  getPoll,
  getAllPolls,
  voteInPoll,
  unVote,
  checkVote,
  deletePoll,
};
