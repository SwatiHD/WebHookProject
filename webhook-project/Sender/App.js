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
