const API_URL = "/api";

async function apiRequest(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("Invalid response from server");
        }

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Request failed");
        }

        return data;

    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Server took too long to respond. Please try again.");
        }

        if (error.message === "Failed to fetch") {
            throw new Error("Unable to connect to the server.");
        }

        throw error;

    } finally {
        clearTimeout(timeout);
    }
}


// =========================
// REGISTER
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("message");
        const submitButton =
            registerForm.querySelector("button[type='submit']");

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Registering...";

            if (message) {
                message.textContent = "";
                message.className = "";
            }

            const data = await apiRequest(
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
                message.textContent = error.message;
                message.className = "error-message";
            }

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Register";
        }
    });
}


// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("message");
        const submitButton =
            loginForm.querySelector("button[type='submit']");

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Logging in...";

            if (message) {
                message.textContent = "";
                message.className = "";
            }

            const data = await apiRequest(
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

            localStorage.setItem("token", data.token);

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
                message.textContent = error.message;
                message.className = "error-message";
            }

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }
    });
}