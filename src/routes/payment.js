const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_receipt",
      partial_payment: false,
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailId: req.user.emailId,
        userId: req.user._id,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  } finally {
    res.status(200).send("Payment");
  }
  res.send("Payment")
});

module.exports = paymentRouter;