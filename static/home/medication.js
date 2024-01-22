document.addEventListener("DOMContentLoaded", () => {
  fetchMedications();
});

function fetchMedications() {
  fetch("http://localhost:9000/medications")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      renderMedications(data);
    })
    .catch(error => console.error("Error fetching medications:", error));
}

function renderMedications(medications) {
  const medicationsList = document.getElementById("medications-list");

  medicationsList.innerHTML = "";

  medications.forEach(medication => {
    const listItem = document.createElement("li");
    listItem.textContent = medication.medicationName;
    medicationsList.appendChild(listItem);
  });
}
