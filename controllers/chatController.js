const { Types } = require("mongoose");
const Chat = require("../model/Chat");
const User = require("../model/User");

const sendMessage = async (payload) => {
  const chat = await Chat.create(payload);
  return chat;
};

const getRecentChats = async (req, res) => {
  // const recentChats = await Chat.aggregate([
  //   {
  //     $match: {
  //       $or: [
  //         { from: new Types.ObjectId(req.params.id) },
  //         { to: new Types.ObjectId(req.params.id) },
  //       ],
  //     },
  //   },
  //   // {
  //   //   $project: { $or: [{ from: req.params.id }, { to: req.params.id }] },
  //   // },
  //   {
  //     $sort: {
  //       createdAt: -1,
  //     },
  //   },
  //   {$limit: 10}
  // ]);
  const recentChats = await User.aggregate([
    {
      $match: {
        $expr: {
          $not: {
            $eq: ["$_id", new Types.ObjectId(req.params.id)],
          },
        },
      },
    },
    {
      $lookup: {
        from: "chats",
        as: "chatHistory",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $and: [
                      { $eq: ["$from", "$$id"] },
                      { $eq: ["$to", new Types.ObjectId(req.params.id)] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: ["$from", new Types.ObjectId(req.params.id)] },
                      { $eq: ["$to", "$$id"] },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ]);
  res.json(recentChats);
};

module.exports = {
  sendMessage,
  getRecentChats,
};
