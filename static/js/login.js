document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("Login successful");
        window.location.href = "../home/home.html";
      } else if (response.status === 400) {
        alert("User not found, please sign up"); // You can handle the error message in a better way (e.g., displaying it on the page)
      } else if (response.status === 401) {
        alert("Wrong password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again."); // Handle unexpected errors
    }
  });
