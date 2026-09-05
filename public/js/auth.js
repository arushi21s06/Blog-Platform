const API_URL = "/api";


// ========================================
// API REQUEST HELPER
// ========================================

async function apiRequest(url, options = {}) {

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 15000);


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

            throw new Error(
                "Invalid response from server"
            );

        }


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Request failed"
            );

        }


        return data;


    } catch (error) {

        if (error.name === "AbortError") {

            throw new Error(
                "Server took too long to respond. Please try again."
            );

        }


        if (error.message === "Failed to fetch") {

            throw new Error(
                "Unable to connect to the server."
            );

        }


        throw error;


    } finally {

        clearTimeout(timeout);

    }

}


// ========================================
// REGISTER
// ========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const message =
                document.getElementById("message");


            const submitButton =
                registerForm.querySelector(
                    "button[type='submit']"
                );


            try {

                const name =
                    document
                        .getElementById("name")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById("password")
                        .value;


                // ------------------------
                // VALIDATION
                // ------------------------

                if (!name) {

                    throw new Error(
                        "Please enter your name."
                    );

                }


                if (!email) {

                    throw new Error(
                        "Please enter your email."
                    );

                }


                if (!email.includes("@")) {

                    throw new Error(
                        "Please enter a valid email address."
                    );

                }


                if (!password) {

                    throw new Error(
                        "Please enter a password."
                    );

                }


                if (password.length < 6) {

                    throw new Error(
                        "Password must be at least 6 characters."
                    );

                }


                // ------------------------
                // SHOW LOADING
                // ------------------------

                submitButton.disabled = true;

                submitButton.textContent =
                    "Registering...";


                if (message) {

                    message.textContent = "";

                    message.className = "";

                }


                // ------------------------
                // REGISTER REQUEST
                // ------------------------

                const data =
                    await apiRequest(
                        `${API_URL}/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })
                        }
                    );


                // ------------------------
                // AUTOMATIC LOGIN
                // ------------------------

                localStorage.setItem(
                    "token",
                    data.token
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                // ------------------------
                // SUCCESS MESSAGE
                // ------------------------

                if (message) {

                    message.textContent =
                        "✅ Account created! Redirecting...";

                    message.className =
                        "success-message";

                }


                // ------------------------
                // GO DIRECTLY TO HOME
                // ------------------------

                setTimeout(() => {

                    window.location.href = "/";

                }, 500);


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;

                    message.className =
                        "error-message";

                }


            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Register";

            }

        }
    );

}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const message =
                document.getElementById("message");


            const submitButton =
                loginForm.querySelector(
                    "button[type='submit']"
                );


            try {

                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById("password")
                        .value;


                // ------------------------
                // VALIDATION
                // ------------------------

                if (!email) {

                    throw new Error(
                        "Please enter your email."
                    );

                }


                if (!password) {

                    throw new Error(
                        "Please enter your password."
                    );

                }


                // ------------------------
                // SHOW LOADING
                // ------------------------

                submitButton.disabled = true;

                submitButton.textContent =
                    "Logging in...";


                if (message) {

                    message.textContent = "";

                    message.className = "";

                }


                // ------------------------
                // LOGIN REQUEST
                // ------------------------

                const data =
                    await apiRequest(
                        `${API_URL}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                // ------------------------
                // SAVE LOGIN INFORMATION
                // ------------------------

                localStorage.setItem(
                    "token",
                    data.token
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                // ------------------------
                // SUCCESS MESSAGE
                // ------------------------

                if (message) {

                    message.textContent =
                        "✅ Login successful! Redirecting...";

                    message.className =
                        "success-message";

                }


                // ------------------------
                // GO TO HOME
                // ------------------------

                setTimeout(() => {

                    window.location.href = "/";

                }, 500);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;

                    message.className =
                        "error-message";

                }


            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Login";

            }

        }
    );

}