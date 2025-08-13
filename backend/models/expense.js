const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Expense", expenseSchema);
