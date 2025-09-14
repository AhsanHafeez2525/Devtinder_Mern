const mongoose = require("mongoose");
const validator = require("validator");
const connectionRequestSchema = mongoose.Schema(
  {
    // sender
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // refering to the user model
      //   mandatory
      required: true,
    },
    // reciever
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      //   mandatory
      required: true,
    },
    status: {
      type: String,
      //   mandatory
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE is incorrect status type }`,
      },
    },
  },
  {
    timestamps: true,
  }
);
// ConnectionRequest.find({fromUserId: 2332423543531})  is very fast because of index
// ConnectionRequest.find({fromUserId: 2332423543531, toUserId: 2332423543531}) is very slow because of index
// ConnectionRequest.find({fromUserId: 2332423543531, toUserId: 2332423543531}).sort({createdAt: -1}) is very slow because of index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });   // 1 is for ascending order and -1 is for descending order and compound index
connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  // check if fromuserId is same as toUserId
  if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
    throw new Error("From user and to user cannot be same");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
