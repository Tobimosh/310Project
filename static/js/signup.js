document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const email = document.getElementById("email").value;
    const sex = document.getElementById("sex").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, sex, firstName, lastName, password }),
        });

        if (response.status === 200) {
            alert('Sign up successful, please login')
        } else {
            const errorMessage = await response.text();
            alert(errorMessage); // You can handle the error message in a better way (e.g., displaying it on the page)
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again."); // Handle unexpected errors
    }
});
