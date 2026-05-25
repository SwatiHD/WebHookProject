import axios from "axios";
import crypto from "crypto";

const SECRET = process.env.SECRET;

const RECEIVER_URL = "http://localhost:5000/webhook";

function generateSignature(timestamp, body) {
  const payload = `${timestamp}.${body}`;

  return crypto
    .createHmac("sha256", process.env.SECRET)
    .update(payload)
    .digest("hex");
}

async function sendWebhook(orderData, retryCount = 0) {
  try {
    const rawBody = JSON.stringify(orderData);

    const timestamp = Math.floor(Date.now() / 1000);

    const signature = generateSignature(timestamp, rawBody);

    const response = await axios.post(RECEIVER_URL, rawBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Timestamp": timestamp,
        "X-Webhook-Signature": signature,
      },
    });
    console.log("Webhook Success", response.status);
  } catch (error) {
    console.log("Webhook Failed");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    if (retryCount < 3) {
      const delays = [1000, 3000, 9000];

      const delay = delays[retryCount];

      console.log(`Retrying in ${delay / 1000} seconds`);

      setTimeout(() => {
        sendWebhook(orderData, retryCount + 1);
      }, delay);
    } else {
      console.log("Maximum retries completed");
    }
  }
}

export default sendWebhook;
