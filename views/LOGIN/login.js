document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:9000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        alert("Login successful");
        window.location.href = "http://127.0.0.1:5500/views/home/home.html";
      } else if (response.status === 400) {
        const errorMessage = await response.text();

        alert("User not found, please sign up"); // You can handle the error message in a better way (e.g., displaying it on the page)
      } else if (response.status === 401) {
        alert("Wrong password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again."); // Handle unexpected errors
    }
  });
