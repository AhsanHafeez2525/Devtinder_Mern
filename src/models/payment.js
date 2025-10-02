const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
  },
  receipt: {
    type: String,
  },
  notes: {
    type: Object,
  },
  paymentId: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  paymentDate: { 
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);