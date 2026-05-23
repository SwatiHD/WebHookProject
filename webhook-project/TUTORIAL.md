# Building a Secure Webhook using Node.js

A webhook?! 
That's the first question I had when I first read it. 
I checked on the internet for the meaning.
And it said, "An automated, event-driven method for one application to send real-time data to another". 
Now the real question is - Did you understand what that meant?
Yes, even I felt it like technically deep.

That's when I decided to build one!
This project is the result of that.

By the end of this project, we will understand:
-What webhooks really are?
-What is HMAC and why we use?
-How two backend systems work?
-How webhook verification works?

The problem we are solving with webhook:
Suppose, you have a online store. The customer drops an order. To deliver this order, the warehouse team should be aware of the order creation. So, they will keep guessing:
-Is there any new order?
-Is there any new order now?
-How about now?
That's so inefficient!!!!

Instead, the online store should send the notification to the warehouse team automatically, that order is created.
That automatic notification is nothing but the WEBHOOK!!
Simple right??

So, A webhook is an HTTP request sent from one system to another when an event is trigerred.

In this Project:
#Sender creates Orders
#Reciever gets the notification about the order

So we have two backend system 
1. Sender
    -creates orders
    -stores them in MongoDB
    -sends webhook events
2. Reciever
    -receives webhook requests
    -verifies they are authentic
    -accepts or rejects them

Here's the entire flow of the systems

![Full Flow](Workflow.png)

Simple concept. But there are lot of interesting things happening inside.

Let's dive into the code.

Sender App is the root of the whole project.
its runs on http://localhost:4000

```python
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use(orderRoutes);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Sender running on port ${PORT}`);
});
```
Before the Sender App receives the HTTP request(order) we set up the Express framework, MongoDB must be connected, routes must be registered. Here, sender sever basically gets ready and waits for the request.


```python
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

    sendWebhook(newOrder);
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
```

When we make a POST /order request from Postman, the path is matched with the router.post("/order") and the db values are extracted from req.body and document is created and saved in MongoDB.

Here the router solves a huge problem:
Without routes the sender server exists but its of no use.So, ain't we solving a problem by
-accepting orders
-saving the orders
-trigerring the notifications
here?

Right after saving the order data, the webhook concept starts when the control flow goes to the line sendWebhook(newOrder); This tells the reciever App that the new order is created.

Thus, we are here with the most important concept HMAC.

```python
import axios from "axios";
import crypto from "crypto";

const SECRET = "mysecretkey";

const RECEIVER_URL = "http://localhost:5000/webhook";

function generateSignature(timestamp, body) {
  const payload = `${timestamp}.${body}`;

  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
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
```
So, by now we know, Sender sends the notification to the Reciever. But, what if it's a fake webhook request?? 
How will the reciever know:
-Who sent the reuqest?
-Is the payload modified?
-if someone forged the request?
This is where HMAC authentication steps in.

HMAC (Hash-Based Message Authentication Code) is a cryptographic technique that ensures data integrity and authenticity using a hash function and a secret key. The cryptographic hash function may be MD-5, SHA-1, or SHA-256.

HMACs provides Sender and Reciever with a shared private key that is known only to them. When the Sender requests the Reciever, it hashes the requested data with the private key and sends it along the request. When the Sender receives the request, it makes its own HMAC. Both the HMACS are compared and if both are equal, the Sender is said to be genuine. 

