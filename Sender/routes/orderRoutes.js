import express from "express";
import Order from "../models/Order.js";
import sendWebhook from "../services/webhookService.js";

const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    const { amount, status } = req.body;

    const newOrder = await Order.create({
      amount,
      status,
    });

    await sendWebhook(newOrder);
    res.status(201).json({
      message: "Order created",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
