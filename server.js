const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mini-peerfives", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: String,
  p5Balance: { type: Number, default: 100 },
  rewardBalance: { type: Number, default: 0 },
});

const rewardSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  date: { type: Date, default: Date.now },
  points: Number,
  givenBy: String,
  givenTo: String,
});

const User = mongoose.model("User", userSchema);
const Reward = mongoose.model("Reward", rewardSchema);

// Create a new user
app.post("/users", async (req, res) => {
  const { name } = req.body;
  const newUser = new User({ name });
  await newUser.save();
  res.status(201).json(newUser);
});

// Edit user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const user = await User.findOneAndUpdate({ id }, { name }, { new: true });
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ id });
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Give P5 points
app.post("/users/:id/p5", async (req, res) => {
  // Route for giving P5 points (already implemented)
});

// Get reward history for user
app.get("/users/:id/rewards", async (req, res) => {
  // Route for getting reward history (already implemented)
});

// Delete a reward
app.delete("/rewards/:rewardId", async (req, res) => {
  // Route for deleting a reward (already implemented)
});

app.post("/users/:id/transfer-p5", async (req, res) => {
  const { id } = req.params;
  const { recipientId, amount } = req.body;

  try {
    const sender = await User.findById(id);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ error: "User not found" });
    }

    if (sender.p5Balance < amount) {
      return res.status(400).json({ error: "Insufficient P5 balance" });
    }

    sender.p5Balance -= amount;
    recipient.p5Balance += amount;

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: "P5 points transferred successfully" });
  } catch (error) {
    console.error("Error transferring P5 points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
