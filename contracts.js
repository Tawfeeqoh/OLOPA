// src/routes/contracts.js
const express = require("express");
const Contract = require("../models/Contract");
const router = express.Router();

// Create Contract
router.post("/", async (req, res) => {
  try {
    const { title, description, employer, amount } = req.body;
    const contract = new Contract({ title, description, employer, amount });
    await contract.save();
    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Contracts
router.get("/", async (req, res) => {
  const contracts = await Contract.find().populate("employer freelancer");
  res.json(contracts);
});

module.exports = router;