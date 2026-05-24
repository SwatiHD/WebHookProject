# Secure Webhook System With HMAC Verification

This project is a beginner-friendly implementation of a secure webhook architecture using Node.js, Express, MongoDB, Axios, and HMAC SHA256 signature verification.

The goal of this project was not just to send HTTP requests between applications, but to understand how real-world platforms like Stripe, Razorpay, GitHub, and Slack securely communicate events between services.

---
<img width="1647" height="955" alt="FullFlow" src="https://github.com/user-attachments/assets/f821812b-a9f8-4a16-b0e5-8af64a17b6e6" />

# Why I Built This Project

While learning backend development, I kept hearing terms like:
- webhooks
- HMAC authentication
- signature verification
- replay attacks
- raw request body

I understood the definitions, but I didn’t fully understand how these systems actually worked internally.

So instead of only reading theory, I decided to build a complete sender-receiver webhook system from scratch.

This project helped me understand:
- event-driven communication
- secure webhook verification
- service-to-service communication
- retry mechanisms
- request lifecycle in Express
- why raw request bodies matter in cryptographic verification

---

# The Problem This Project Solves

When two applications communicate through webhooks, the receiver should never blindly trust incoming requests.

Without verification:
- fake requests can be sent
- payloads can be modified
- attackers can replay old requests

This project solves those problems using:
- HMAC SHA256 signatures
- timestamp-based verification
- raw request body validation
- retry logic for failed deliveries

---

# Project Architecture

```txt
Sender App  →  Receiver App
