const { Schema, Types, model } = require("mongoose");

const chatSchema = new Schema(
  {
    from: {
      type: Types.ObjectId,
      required: true,
    },
    to: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);
module.exports = Chat;
