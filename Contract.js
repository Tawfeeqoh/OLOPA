// src/models/Contract.js
const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  employer: { type: String, required: true }, // Wallet address
  freelancer: { type: String }, // Wallet address
  amount: { type: Number, required: true },
  transactionSignature: { type: String }, // Solana transaction signature
  escrowAddress: { type: String }, // Escrow account address
  status: { 
    type: String, 
    enum: ["created", "simulated", "funded", "pending", "active", "completed", "cancelled"], 
    default: "created" 
  },
}, { timestamps: true });

module.exports = mongoose.model("Contract", contractSchema);