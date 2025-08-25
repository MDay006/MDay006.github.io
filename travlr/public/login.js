const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const toggleLink = document.getElementById("toggle-link");
const toggleText = document.getElementById("toggle-text");
const formTitle = document.getElementById("form-title");

let showingLogin = true;

// Toggle between login/register
toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  showingLogin = !showingLogin;
  
  if (showingLogin) {
    loginForm.style.display = "inline";
    registerForm.style.display = "none";
    formTitle.textContent = "Login";
    toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Register here</a>`;
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "Register";
    toggleText.innerHTML = `Already have an account? <a href="" id="toggle-link">Login here</a>`;
  }
  
  document.getElementById("toggle-link").addEventListener("click", arguments.callee);
});


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', 
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();

    if (res.ok) {
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Error logging in: " + err.message);
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Please log in.");
      showingLogin = true;
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      formTitle.textContent = "Login";
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    alert("Error registering: " + err.message);
  }
});