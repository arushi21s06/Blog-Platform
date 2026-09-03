const API_URL = "http://localhost:5000/api";


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!name || !email || !password) {
            registerMessage.textContent =
                "Please fill in all fields.";
            return;
        }

        try {

            const response = await fetch(
                API_URL + "/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log("Register response:", data);

            if (!response.ok || !data.success) {

                registerMessage.textContent =
                    data.message || "Registration failed.";

                return;
            }

            registerMessage.textContent =
                "Registration successful! Redirecting to login...";

            registerForm.reset();

            setTimeout(function () {
                window.location.href = "/login.html";
            }, 1000);

        } catch (error) {

            console.error("Registration error:", error);

            registerMessage.textContent =
                "Unable to connect to the server.";
        }
    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            loginMessage.textContent =
                "Please enter your email and password.";
            return;
        }

        try {

            const response = await fetch(
                API_URL + "/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log("Login response:", data);

            if (!response.ok || !data.success) {

                loginMessage.textContent =
                    data.message || "Login failed.";

                return;
            }

            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );

            loginMessage.textContent =
                "Login successful! Redirecting...";

            setTimeout(function () {
                window.location.href = "/";
            }, 1000);

        } catch (error) {

            console.error("Login error:", error);

            loginMessage.textContent =
                "Unable to connect to the server.";
        }
    });
}