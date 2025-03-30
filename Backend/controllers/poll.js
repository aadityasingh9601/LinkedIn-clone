const createPoll = (req, res) => {
  console.log(req.body);
  res.send("Request received inside createPoll function.");
};

const getPoll = (req, res) => {
  //console.log(req.body);
  res.send("Request received inside getPoll function.");
};

export default {
  createPoll,
  getPoll,
};
