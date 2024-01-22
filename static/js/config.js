const mongoose = require("mongoose");

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
  username: {
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
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
