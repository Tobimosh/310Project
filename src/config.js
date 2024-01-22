const mongoose = require("mongoose");
const { date, number } = require("zod");
// Mongoose is an object document mapping (ODM) layer which sits on the top of Node’s MongoDB driver.

const connect = mongoose.connect(
  "mongodb+srv://oluwatobimoshood16:mosh1234@cluster0.itu8aie.mongodb.net/?retryWrites=true&w=majority"
);

connect
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

var db = mongoose.connection;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const medSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
  medicationName: {
    type: String,
    required: true,
  },
  grams: {
    type: Number,
    required: true,
  },
  additionalInfo: {
    type: String,
    required: false,
  },
  reminderTime: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model("users", UserSchema);
const medication = mongoose.model("medications", medSchema);

module.exports = { User, medication };
