const mongoose = require("mongoose");
require("dotenv").config();

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Close connection after tests
  await mongoose.connection.close();
});
