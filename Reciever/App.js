import express from "express";
import webhookRoutes from "./routes/webhookRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(webhookRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Receiver running on port ${PORT}`);
});
