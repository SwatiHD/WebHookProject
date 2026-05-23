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

