const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const homeSection = document.getElementById("homeSection");
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const userInfo = document.getElementById("userInfo");

// Show only one section
function showSection(section) {
    homeSection.style.display = "none";
    loginSection.style.display = "none";
    registerSection.style.display = "none";

    section.style.display = "block";
}

// Login button
loginBtn.addEventListener("click", () => {
    showSection(loginSection);
});

// Register button
registerBtn.addEventListener("click", () => {
    showSection(registerSection);
});

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    updateAuthUI();
    showSection(homeSection);
});

// Register
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    registerMessage.textContent = "Creating account...";

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            registerMessage.textContent = data.message || "Registration failed";
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        registerMessage.textContent = "Registration successful!";

        registerForm.reset();

        updateAuthUI();

        setTimeout(() => {
            showSection(homeSection);
        }, 1000);

    } catch (error) {
        console.error(error);
        registerMessage.textContent = "Unable to connect to server";
    }
});

// Login
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    loginMessage.textContent = "Logging in...";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.message || "Login failed";
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        loginMessage.textContent = "Login successful!";

        loginForm.reset();

        updateAuthUI();

        setTimeout(() => {
            showSection(homeSection);
        }, 1000);

    } catch (error) {
        console.error(error);
        loginMessage.textContent = "Unable to connect to server";
    }
});

// Update UI based on login status
function updateAuthUI() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";

        userInfo.innerHTML = `
            <h3>Welcome, ${user.name}!</h3>
            <p>You are logged in as ${user.email}</p>
        `;
    } else {
        loginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";

        userInfo.innerHTML = "";
    }
}

// Check login status when page loads
updateAuthUI();