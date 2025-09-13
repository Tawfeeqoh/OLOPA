const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth");
const contractRoutes = require("./src/routes/contracts");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Routes
app.use("/api/users", authRoutes);
app.use("/api/contracts", contractRoutes);


// Connect DB and Start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("DB connection error:", err));