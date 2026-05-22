import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});
const Order = mongoose.model("Order", orderSchema);

export default Order;
