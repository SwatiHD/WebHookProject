import express from "express";
import crypto from "crypto";

const router = express.Router();

const SECRET = process.env.SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      const signature = req.headers["x-webhook-signature"];

      const timestamp = req.headers["x-webhook-timestamp"];
      if (!signature) {
        return res.status(400).json({
          message: "Missing signature",
        });
      }

      if (!timestamp) {
        return res.status(400).json({
          message: "Missing timestamp",
        });
      }

      const rawBody = req.body.toString();

      const payload = `${timestamp}.${rawBody}`;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.SECRET)
        .update(payload)
        .digest("hex");
      if (signature !== expectedSignature) {
        return res.status(401).json({
          message: "Invalid signature",
        });
      }

      const parsedData = JSON.parse(rawBody);

      console.log("Verified Payload");
      console.log(parsedData);

      return res.status(200).json({
        message: "Webhook verified successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
);

export default router;
