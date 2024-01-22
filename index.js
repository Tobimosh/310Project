const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { User, medication } = require("./static/js/config");
const webpush = require("web-push");
const session = require("express-session");
const app = express();
const verfiyToken = require("./verifyToken");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const publicVapidKey =
  "BA5sFswpSTJHoDRFeVsotsY_v5yFDx5WXtkjzV-bl8KyKNxALohTDSKr8ahV53bdKqDhaQk5_sOxzvKFZqGQp0g";
const privateVapidkey = "5XuuolmIcVfEQ037awM4y9lqyySJiZl22RrPiFaQ67k";

webpush.setVapidDetails(
  "mailto:test@gmail.com",
  publicVapidKey,
  privateVapidkey
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "views")));
app.use(cors()); // Enable CORS for all routes
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "static")));

app.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res
        .status(400)
        .send("User already exists. Please try another username");
    }

    const userData = await User.create({
      username: req.body.username,
      password: req.body.password,
      sex: req.body.sex,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    console.log(userData);
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});


app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send("User cannot be found");
    }
    if (req.body.password !== user.password) {
      return res.status(401).send("Wrong password");
    }

    const token = jwt.sign({ _id: user.id, username: user.username }, "moshood");

    res.cookie("authToken", token);

    res.status(200).send({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});


app.get("/getUsername", verfiyToken, (req, res) => {
  res.json({ username: req.user.username });
});



app.post("/addMedication", verfiyToken, async (req, res) => {
  try {
    console.log(req.session);
    const medData = await medication.create({
      user: req.user._id,
      medicationName: req.body.medicationName,
      reminderTime: req.body.reminderTime,
      grams: req.body.grams,
      additionalInfo: req.body.additionalInfo,
    });

    const payload = JSON.stringify({
      title: "Medication Reminder",
      description: req.body.additionalInfo,
    });

    webpush
      .sendNotification(medData, payload)
      .catch((error) => console.log(error));

    return res
      .status(200)
      .send("Medication saved successfully. You'll be reminded in due time");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/subscribe", (req, res) => {
  const body = req.body;
  subscription = body.subscription;
  description = body.description;
  res.status(201).json({});

  const payload = JSON.stringify({
    title: "Medication Reminder",
    description: description,
  });

  webpush
    .sendNotification(subscription, payload)
    .catch((error) => console.log(error));
});

app.get("/medications", verfiyToken, async (req, res) => {
  try {
    const userMedications = await medication.find({
      user: req.user._id,
    });

    res.send(userMedications)
    // res.render("medications", { medications: userMedications });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

const port = 9000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
