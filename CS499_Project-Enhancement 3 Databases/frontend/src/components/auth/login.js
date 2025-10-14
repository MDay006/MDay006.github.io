import ApiService from '/services/api.js';
import { setAuth, isAuthenticated } from '/services/auth.js';
import { ROUTES } from '/utils/constants.js';

class LoginComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      window.location.href = ROUTES.DASHBOARD;
      return;
    }

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="container">
        <div class="section">
          <h1>Login</h1>
          <form id="loginForm">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required>
              <span id="usernameError" class="error hidden"></span>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
              <span id="passwordError" class="error hidden"></span>
            </div>
            <div id="formError" class="error hidden"></div>
            <button type="submit" id="loginBtn">
              <span class="btn-text">Login</span>
              <span class="btn-spinner hidden">Logging in...</span>
            </button>
          </form>
          <br>
          <p>Don't have an account? <a href="${ROUTES.REGISTER}">Register</a></p>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', this.handleSubmit.bind(this));

    // Real-time validation
    document.getElementById('username').addEventListener('blur', this.validateUsername.bind(this));
    document.getElementById('password').addEventListener('blur', this.validatePassword.bind(this));
  }

  validateUsername() {
    const username = document.getElementById('username').value;
    const errorEl = document.getElementById('usernameError');
    
    if (!username) {
      errorEl.textContent = 'Username is required';
      errorEl.classList.remove('hidden');
      return false;
    }
    
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
    return true;
  }

  validatePassword() {
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('passwordError');
    
    if (!password) {
      errorEl.textContent = 'Password is required';
      errorEl.classList.remove('hidden');
      return false;
    }
    
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateUsername() || !this.validatePassword()) {
      return;
    }

    const formData = new FormData(e.target);
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password')
    };

    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnSpinner = loginBtn.querySelector('.btn-spinner');
    const formError = document.getElementById('formError');

    try {
      // Show loading state
      loginBtn.disabled = true;
      btnText.classList.add('hidden');
      btnSpinner.classList.remove('hidden');
      formError.textContent = '';
      formError.classList.add('hidden');

      const response = await ApiService.login(credentials);
      setAuth(response.token, response.user);

      // Redirect based on role
      if (response.user.role === 'admin') {
        window.location.href = ROUTES.ADMIN;
      } else {
        window.location.href = ROUTES.DASHBOARD;
      }
    } catch (error) {
      formError.textContent = error.message;
      formError.classList.remove('hidden');
    } finally {
      // Reset loading state
      loginBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
    }
  }
}

export default LoginComponent;