const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require('cors')
const { User, medication } = require("./config");
const cron = require('node-cron');
const webpush = require('web-push')

const app = express();

const publicVapidKey = 'BA5sFswpSTJHoDRFeVsotsY_v5yFDx5WXtkjzV-bl8KyKNxALohTDSKr8ahV53bdKqDhaQk5_sOxzvKFZqGQp0g'; 
const privateVapidkey = '5XuuolmIcVfEQ037awM4y9lqyySJiZl22RrPiFaQ67k';


webpush.setVapidDetails('mailto:test@gmail.com', publicVapidKey, privateVapidkey)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')))
app.use(cors());  // Enable CORS for all routes

app.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(400)
        .send("User already exists. Please try another email");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = await User.create({
      email: req.body.email,
      password: hashedPassword,
      sex: req.body.sex,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    console.log(userData);
    return res.status(200).redirect("http://127.0.0.1:5500/views/SIGNUP/signUpSuccessful.html");

  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});



app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("User cannot be found");
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).send("Wrong password");
    }
    return res.status(200).redirect("http://127.0.0.1:5500/views/LOGIN/loginSuccessful.html");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});



app.post("/addMedication", async (req, res) => {
  try {
 

    const medData = await medication.create({
      // user: user._id,
      medicationName: req.body.medicationName,
      reminderTime: req.body.reminderTime,
      grams: req.body.grams,
      additionalInfo: req.body.additionalInfo
    });

    const payload = JSON.stringify({ title: 'Medication Reminder', description: req.body.additionalInfo });

    // pass object into sendNotification
    webpush.sendNotification(medData, payload).catch(error => console.log(error));

    return res.status(200).send("Medication saved successfully. You'll be reminded in due time");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/subscribe", (req, res) =>{
    const body = req.body;
    subscription = body.subscription;
    description = body.description
    res.status(201).json({});

    const payload = JSON.stringify({title: 'Medication Reminder', description: description})

    //pass object into sendNotification
    webpush.sendNotification(subscription, payload).catch(error => console.log(error));
})


const port = 9000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});