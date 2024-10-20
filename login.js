// Check if the username already exists in local storage
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("username")) {
        window.location.href = "home.html";
    }
});

function toggleSection(section) {
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");

    if (section === 'signup') {
        loginSection.classList.add("d-none");
        signupSection.classList.remove("d-none");
    } else {
        signupSection.classList.add("d-none");
        loginSection.classList.remove("d-none");
    }
}

async function onLoginClick() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        window.alert("All fields are required!");
        return;
    }

    try {
        const response = await axios.post("http://localhost:8080/login", { email, password });
        
        // Save username and navigate to home
        localStorage.setItem("username", response.data.username);
        window.location.href = "home.html";
    } catch (error) {
        console.error("Error during login:", error);
        window.alert("Login failed: " + (error.response?.data?.msg || error.message));
    }
}

async function onSignupClick() {
    const firstName = document.getElementById("signup-firstname").value;
    const lastName = document.getElementById("signup-lastname").value;
    const userName = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const phone = document.getElementById("signup-phone").value;

    if (!firstName || !lastName || !userName || !email || !password || !phone) {
        window.alert("All fields are required!");
        return;
    }

    try {
        const response = await axios.post("http://localhost:8080/signup", {
            firstName, lastName, userName, email, password, phone
        });

        // If signup is successful, show success alert and switch to login
       
        console.log(response.data.msg);
        toggleSection('login');     
        
    } catch (error) {
        console.error("Error during signup:", error);
        window.alert("Signup failed: " + (error.response?.data?.msg || error.message));
    }
}
