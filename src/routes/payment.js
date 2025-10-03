const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants");
/* NODE SDK: https://github.com/razorpay/razorpay-node */
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')


paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { amount, membership } = req.body;
    const {firstName, lastName, emailId} = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membership] * 100,
      currency: "INR",
      receipt: "order_receipt",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        membership: membership,
        userId: req.user._id,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: amount,
      status: order.status,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
      paymentId: order.id,
    });
    const paymentData = await payment.save();
    res.json({...paymentData.toJSON(), keyID: process.env.RAZORPAY_KEY_ID});
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

paymentRouter.post("/payment/webhook", userAuth, async (req, res) => {
  try {
const isWbeHookValid = validateWebhookSignature(JSON.stringify(req.body), req.headers['x-razorpay-signature'], process.env.RAZORPAY_WEBHOOK_SECRET)

    if (!isWbeHookValid) {
      return res.status(400).send("ERROR: Invalid webhook signature");
    }
    // update the payment status in DB
    // update the user as premium

    const paymentDetails = req.body.payload.payment.entity;
  const payment = await Payment.findOne({ paymentId: paymentDetails.order_id });
  payment.paymentStatus = paymentDetails.status;
  await payment.save();
  const user = await User.findById(payment.userId);
  user.isPremium = true;
  user.membershipType = paymentDetails.notes.membership;
  await user.save();
    // if(req.body.event === "payment.captured") {
    // }

    // if(req.body.event === "payment.failed") {
    // }
  // return the success response to razorpay
    res.status(200).json({message: "Webhook received"});
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

paymentRouter.get("/payment/premium", userAuth, async (req, res) => {
  try {
    const user = req.user.toJSON();
    if(user.isPremium) {
      return res.json({...user});
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = paymentRouter;