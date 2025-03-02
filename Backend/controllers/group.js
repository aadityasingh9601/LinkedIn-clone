import Group from "../models/Group.js";
import User from "../models/User.js";
import { notifyAdmins, notifyUser } from "../server.js";

const createGroup = async (req, res) => {
  const { groupName, groupbanner, description, rules, visibility, tags } =
    req.body;
  const newGroup = new Group({
    owner: req.user._id,
    groupName: groupName,
    groupBanner: groupbanner,
    description: description,
    rules: rules,
    visibility: visibility,
    tags: tags,
    members: [req.user._id],
    admins: [req.user._id],
  });
  await newGroup.save();
  const user = await User.findById(req.user._id);
  user.myGroups.push(newGroup._id);
  await user.save();
  res.status(200).send("Group created successfully!");
};

const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { groupName, groupBanner, description, rules, visibility, tags } =
    req.body;
  const group = await Group.findById(id);
  //for now, I am using these if statements because I am testing once,the whole object starts coming from
  //frontend , edit these paths & make it look cleaner , like the edit path in our major project.
  if (req.user._id.toString() === group.owner.toString()) {
    if (groupName) {
      group.groupName = groupName;
    }
    if (groupBanner) {
      group.groupBanner = groupBanner;
    }
    if (description) {
      group.description = description;
    }
    if (rules) {
      group.rules = rules;
    }
    if (visibility) {
      group.visibility = visibility;
    }
    if (tags) {
      group.tags = tags;
    }
    await group.save();
    res.status(200).send({ message: "Group updated successfully!" });
  } else {
    res.status(401).send({ message: "You are not the owner of this group!" });
    return;
  }
};

const searchGroups = async (req, res) => {
  const groupname = req.query.q;
  console.log(groupname);
  const groups = await Group.find({ groupName: groupname });
  if (groups.length === 0) {
    res.status(404).send({ message: "No groups found!" });
  } else {
    res.status(200).send(groups);
  }
};

const joinGroup = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const group = await Group.findById(id);
  const currUser = await User.findById(req.user._id);
  if (group.visibility === "Public") {
    if (group.members.includes(req.user._id)) {
      res
        .status(400)
        .send({ message: "You are already a member of this group!" });
      return;
    } else {
      group.members.push(req.user._id);
      await group.save();
      currUser.myGroups.push(id);
      await currUser.save();
      res.status(200).send({ message: "Group joined successfully!" });
    }
  }
  if (group.visibility === "Private") {
    if (group.members.includes(req.user._id)) {
      res
        .status(400)
        .send({ message: "You are already a member of this group!" });
      return;
    } else {
      group.joinRequests.push(currUser._id);
      await group.save();
      const notificationMsg = `${currUser.name} has requested to join the group ${group.groupName}.`;
      let data = {
        from: currUser._id,
        message: notificationMsg,
        to: group._id,
        type: "groupjoinreq",
      };
      notifyAdmins(data); // Function to emit notifications
      res.status(200).json({ message: "Join request sent" });
    }
  }
};

const acceptGroupJoinReq = async (req, res) => {
  const { id, userId } = req.params;
  const { response } = req.body;
  console.log(response, id);

  const group = await Group.findById(id);
  const currUser = await User.findById(req.user._id);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  } else {
    if (response === "Accept") {
      group.joinRequests = group.joinRequests.filter(
        (member) => member.toString() !== userId
      );

      const notificationMsg = `Congrats! You are now a member of the group ${group.groupName}`;

      group.members.push(userId);
      let data = {
        from: currUser._id,
        message: notificationMsg,
        to: userId,
        type: "response",
      };
      notifyUser(data);
    }
    if (response === "Reject") {
      group.joinRequests = group.joinRequests.filter(
        (member) => member.toString() !== userId
      );

      const notificationMsg = `${currUser.name} has rejected your request to join the group ${group.groupName}`;
      let data = {
        from: currUser._id,
        message: notificationMsg,
        to: userId,
        type: "response",
      };
      notifyUser(data);
    }

    await group.save();
    return res.status(200).json({ message: `User ${response}ed` });
  }
};

const makeAdmin = async (req, res) => {
  const { id, userId } = req.params;
  const group = await Group.findById(id);
  if (req.user._id.toString() === group.owner.toString()) {
    if (group.members.includes(userId)) {
      group.admins.push(userId);
      await group.save();
      res.status(200).send({ message: "User made admin successfully!" });
    } else {
      res.status(404).send({ message: "You can't make a non-member admin!" });
    }
  } else {
    res
      .status(401)
      .send({ message: "You don't have the power to make this user admin." });
  }
};

const removeAdmin = async (req, res) => {
  const { id, userId } = req.params;
  console.log(userId);
  const group = await Group.findById(id);
  console.log(group.admins.includes(userId));
  if (req.user._id.toString() === group.owner.toString()) {
    if (group.admins.includes(userId)) {
      group.admins = group.admins.filter(
        (admin) => admin.toString() !== userId
      );
      await group.save();
      res.status(200).send({ message: "User removed admin successfully!" });
    } else {
      res.status(404).send({ message: "You can't remove a non-admin!" });
    }
  } else {
    res.status(401).send({
      message: "You don't have the power to remove this user admin.",
    });
  }
};

const leaveGroup = async (req, res) => {
  const { id } = req.params;
  const group = await Group.findById(id);
  if (group.members.includes(req.user._id)) {
    const user = await User.findByIdAndUpdate(req.user._id, {
      $pull: { myGroups: id },
    });
    await user.save();
    const group = await Group.findByIdAndUpdate(id, {
      $pull: { members: req.user._id },
    });

    await group.save();
    res.status(200).send({ message: "Group left successfully" });
  } else {
    res
      .status(404)
      .send({ message: "You can't leave a group you haven't joined!" });
  }
};

const getAllMembers = async (req, res) => {
  const { id } = req.params;
  const group = await Group.findById(id);
  if (req.user._id.toString() === group.owner.toString()) {
    res.status(200).send(group.members);
  } else {
    res.status(401).send({ message: "You are not the owner of this group!" });
    return;
  }
};

const transferOwnership = async (req, res) => {
  const { id, userId } = req.params;
  const group = await Group.findById(id);
  if (req.user._id.toString() === group.owner.toString()) {
    if (group.members.includes(userId)) {
      group.owner = userId;
      await group.save();
      res.status(200).send({ message: "Ownership transferred successfully!" });
    } else {
      res.status(404).send({
        message:
          "You can't transfer ownership to a person who is not a member of this group!",
      });
    }
  } else {
    res.status(401).send({
      message: "You don't have the permission to transfer ownership!",
    });
  }
};

const removeMember = async (req, res) => {
  const { id, userId } = req.params;
  const group = await Group.findById(id);
  if (
    req.user._id.toString() === group.owner.toString() ||
    group.admins.includes(req.user._id)
  ) {
    if (group.members.includes(userId)) {
      group.members = group.members.filter((mem) => mem.toString() !== userId);
      await group.save();
      const user = await User.findByIdAndUpdate(userId, {
        $pull: { myGroups: id },
      });
      res.status(200).send({ message: "Group member removed successfully!" });
    } else {
      res
        .status(404)
        .send({ message: "The member is not a member of this group!" });
    }
  } else {
    res
      .status(401)
      .send({ message: "You don't have the permission to remove a member!" });
    return;
  }
};

const deleteGroup = async (req, res) => {
  const { id } = req.params;
  const group = await Group.findById(id);
  if (req.user._id.toString() === group.owner.toString()) {
    //Remove the association of the group with the user.
    for (let member of group.members) {
      await User.findByIdAndUpdate(member, { $pull: { myGroups: id } });
    }
    await Group.findByIdAndDelete(id);
    res.status(200).send({ message: "Group deleted successfully!" });
  } else {
    res.status(401).send({
      message: "You don't have the permission to delete this group!",
    });
    return;
  }
};

export default {
  createGroup,
  updateGroup,
  searchGroups,
  joinGroup,
  acceptGroupJoinReq,
  makeAdmin,
  removeAdmin,
  leaveGroup,
  getAllMembers,
  transferOwnership,
  removeMember,
  deleteGroup,
};
