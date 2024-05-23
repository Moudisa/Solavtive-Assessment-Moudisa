const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

//connect to mongodb
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

// create a new user
app.post("/users", async (req, res) => {
  const { name } = req.body;
  const newUser = new User({ name });
  await newUser.save();
  res.status(201).json(newUser);
});

//edit user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const user = await User.findOneAndUpdate({ id }, { name }, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//transfer p5 points
app.post("/users/:id/transfer-p5", async (req, res) => {
  const { id } = req.params;
  const { recipientId, amount } = req.body;

  try {
    const sender = await User.findOne({ id });
    const recipient = await User.findOne({ id: recipientId });

    if (!sender || !recipient) {
      return res.status(404).json({ error: "User not found" });
    }

    if (sender.p5Balance < amount) {
      return res.status(400).json({ error: "Insufficient P5 balance" });
    }

    sender.p5Balance -= amount;
    recipient.rewardBalance += amount;

    const reward = new Reward({
      points: amount,
      givenBy: sender._id,
      givenTo: recipient._id,
    });
    await reward.save();

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
