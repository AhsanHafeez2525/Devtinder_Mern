const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
orderId: {
    type: String,
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
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