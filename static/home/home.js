const vapidPublicKey =
  "BA5sFswpSTJHoDRFeVsotsY_v5yFDx5WXtkjzV-bl8KyKNxALohTDSKr8ahV53bdKqDhaQk5_sOxzvKFZqGQp0g";

document
  .getElementById("addMedication")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const medicationName = document.getElementById("medicationName").value;
    const reminderTime = new Date(
      document.getElementById("reminderTime").value
    );
    const grams = document.getElementById("grams").value;
    const additionalInfo = document.getElementById("additionalInfo").value;

    const formatTime = (time) => {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return new Intl.DateTimeFormat("en-US", options).format(time);
    };

    const messageFormat = `Reminder: It's ${formatTime(
      reminderTime
    )}. Time to take ${grams} grams of ${medicationName}.`;

    storeMedDetails(medicationName, reminderTime, grams, additionalInfo);
    setReminder(reminderTime, messageFormat);
  });

const medicationName = document.getElementById("medicationName").value;

function setReminder(alarmTime, message) {
  const currentTime = new Date().getTime();
  const timeUntilAlarm = alarmTime.getTime() - currentTime;

  setTimeout(() => {
    send(message);
  }, timeUntilAlarm);
}


async function fetchUsername() {
  try {
    const response = await fetch("/getUsername", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch username");
    }

    const data = await response.json();
    const username = data.username;

    const showUsernameContainer = document.getElementById("showUsername");
    showUsernameContainer.innerHTML = `<span>Welcome, ${username}!</span>`;

  } catch (error) {
    console.error(error);
  }
}

fetchUsername();


async function send(medicationName) {
  console.log(medicationName);
  console.log("Registering service worker");
  const register = await navigator.serviceWorker.register(
    "service-worker.js",
    {
      scope: "/home/",
    }
  );
  console.log("Service worker registered...");
  console.log("Registering push....");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey,
  });

  console.log("Push registered.....");

  console.log("sending push notifications");
  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify({
      subscription: subscription,
      description: medicationName,
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  console.log("push sent;");
}


function storeMedDetails(medicationName, reminderTime, grams, additionalInfo) {
  fetch("/addMedication", {
    method: "POST",
    body: JSON.stringify({
      medicationName: medicationName,
      grams: grams,
      additionalInfo: additionalInfo,
      reminderTime: reminderTime.toISOString(),
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${document.cookie.split('=')[1]}`,

    },

  })
    .then((res) => {
      if (res.status === 200) {
        alert("Your med reminder has been set! You will be notified in due time");
      } else {
        return res.json(); // Only parse JSON if the response status is not 200
      }
    })
    .then((data) => {
      // Process the JSON data if needed
      console.log("Server response:", data);
    })
    .catch((error) => {
      console.error("Error during API call:", error);
    });
}
