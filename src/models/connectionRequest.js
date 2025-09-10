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

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
