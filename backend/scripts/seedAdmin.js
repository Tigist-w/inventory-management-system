// run with: node scripts/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inventorydb";

async function run() {
  await mongoose.connect(MONGO_URI);
  const exists = await User.findOne({ email: "admin@local" });
  if (exists) {
    console.log("admin exists");
    process.exit(0);
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);
  const u = await User.create({
    name: "Admin",
    email: "admin@local",
    passwordHash,
    role: "admin",
  });
  console.log("admin created", u.email);
  process.exit(0);
}

run().catch(console.error);
