const mongoose = require("mongoose");
const validator = require("validator");
const connectionRequestSchema = mongoose.Schema(
  {
    // sender
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
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
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE is incorrect status type }`,
      },
    },
  },
  {
    timestamps: true,
  }
);
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
