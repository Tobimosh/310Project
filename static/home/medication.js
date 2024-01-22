const fetchData = async () => {
  try {
    const response = await fetch("/medications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayMedications(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


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
    const username = data.username.toUpperCase();

    const showUsernameContainer = document.getElementById("showUsername");
    showUsernameContainer.innerHTML = `<span> ${username}, Here's your registered medications</span>`;

  } catch (error) {
    console.error(error);
  }
}

fetchUsername()

const displayMedications = (medications) => {
  const medicationListContainer = document.getElementById("medicationList");

  medications.forEach((medication) => {
    const medicationCard = document.createElement("div");
    medicationCard.classList.add("medication-card");

    const medicationName = document.createElement("h2");
    medicationName.textContent = `Medication Name: ${medication.medicationName}`;

    const reminderTime = document.createElement("p");

    const dateObject = new Date(medication.reminderTime);

    const formattedDate = dateObject.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    reminderTime.textContent = `Reminder Time: ${formattedDate}`;

    const grams = document.createElement("p");
    grams.textContent = `Amount: ${medication.grams}g`;

    const additionalInfo = document.createElement("p");
    additionalInfo.textContent = `Additional Info: ${medication.additionalInfo}`;

    medicationCard.appendChild(medicationName);
    medicationCard.appendChild(reminderTime);
    medicationCard.appendChild(grams);
    medicationCard.appendChild(additionalInfo);

    medicationListContainer.appendChild(medicationCard);
  });
};

// Call the function to fetch and display data
fetchData();
