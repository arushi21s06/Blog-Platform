const API_URL = "/api";


// ========================================
// REGISTER
// ========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");

        const submitButton =
            registerForm.querySelector("button[type='submit']");

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Creating Account...";

            if (message) {
                message.textContent = "";
            }

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            if (message) {
                message.textContent =
                    "✅ Registration successful! Redirecting to login...";

                message.className = "success-message";
            }

            setTimeout(() => {
                window.location.href = "/login.html";
            }, 1000);

        } catch (error) {
            console.error("Registration error:", error);

            if (message) {
                message.textContent =
                    error.message === "Failed to fetch"
                        ? "Unable to connect to the server."
                        : error.message;

                message.className = "error-message";
            }

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Register";
        }
    });
}


// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");

        const submitButton =
            loginForm.querySelector("button[type='submit']");

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Logging in...";

            if (message) {
                message.textContent = "";
            }

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            localStorage.setItem(
                "token",
                data.token
            );

            if (message) {
                message.textContent =
                    "✅ Login successful! Redirecting...";

                message.className = "success-message";
            }

            setTimeout(() => {
                window.location.href = "/";
            }, 500);

        } catch (error) {
            console.error("Login error:", error);

            if (message) {
                message.textContent =
                    error.message === "Failed to fetch"
                        ? "Unable to connect to the server."
                        : error.message;

                message.className = "error-message";
            }

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }
    });
}