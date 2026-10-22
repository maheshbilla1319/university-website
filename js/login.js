
document.addEventListener("DOMContentLoaded", () => {
  // AOS animations
  if (window.AOS) {
    AOS.init({
      duration: 850,
      once: true,
      offset: 50,
      easing: "ease-out-cubic"
    });
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const loginForm = document.getElementById("loginForm");
  const roleInput = document.getElementById("role");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginButton = document.getElementById("loginButton");
  const googleButton = document.getElementById("googleButton");
  const formMessage = document.getElementById("formMessage");

  // Change password visibility
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.innerHTML = isPassword
      ? '<i class="bi bi-eye-slash"></i>'
      : '<i class="bi bi-eye"></i>';

    togglePassword.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  });

  // Clear individual field errors
  function clearFieldError(fieldName) {
    const errorElement = document.getElementById(fieldName + "Error");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  ["role", "email", "password"].forEach((fieldName) => {
    document.getElementById(fieldName).addEventListener("input", () => {
      clearFieldError(fieldName);
      hideMessage();
    });

    document.getElementById(fieldName).addEventListener("change", () => {
      clearFieldError(fieldName);
      hideMessage();
    });
  });

  function showMessage(message, type = "error") {
    formMessage.textContent = message;
    formMessage.className = "form-message show " + type;
  }

  function hideMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
  }

  function validateForm() {
    let valid = true;

    const role = roleInput.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    ["role", "email", "password"].forEach(clearFieldError);

    if (!["student", "faculty", "staff"].includes(role)) {
      document.getElementById("roleError").textContent =
        "Please select your role.";
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      document.getElementById("emailError").textContent =
        "Please enter your email address.";
      valid = false;
    } else if (!emailPattern.test(email)) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email address.";
      valid = false;
    }

    if (!password) {
      document.getElementById("passwordError").textContent =
        "Please enter your password.";
      valid = false;
    }

    return valid;
  }

  // Redirect based on the role returned by the server.
  const dashboards = {
    student: "student-dashboard.html",
    faculty: "faculty-dashboard.html",
    staff: "staff-dashboard.html"
  };

  // Email/password login
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage();

    if (!validateForm()) {
      showMessage("Please correct the highlighted fields.");
      return;
    }

    loginButton.disabled = true;
    loginButton.innerHTML =
      '<span>Signing in...</span><i class="bi bi-arrow-repeat"></i>';

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: roleInput.value,
          email: emailInput.value.trim(),
          password: passwordInput.value,
          rememberMe: document.getElementById("rememberMe").checked
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      // Only trust the authenticated role returned by your backend.
      if (!data.role || !dashboards[data.role]) {
        throw new Error("The server returned an invalid account role.");
      }

      if (data.role !== roleInput.value) {
        throw new Error("Your account does not match the selected role.");
      }

      // The server must verify credentials and establish a secure session.
      window.location.assign(dashboards[data.role]);
    } catch (error) {
      if (error instanceof TypeError) {
        showMessage(
          "Cannot connect to the login server. Please start your backend and try again."
        );
      } else {
        showMessage(error.message || "Unable to sign in. Please try again.");
      }
    } finally {
      loginButton.disabled = false;
      loginButton.innerHTML =
        '<span>Sign In</span><i class="bi bi-arrow-right"></i>';
    }
  });

  // Google sign-in: requires a configured backend OAuth route.
  googleButton.addEventListener("click", () => {
    hideMessage();

    const role = roleInput.value;

    if (!["student", "faculty", "staff"].includes(role)) {
      showMessage("Please select Student, Faculty, or Staff before continuing with Google.");
      roleInput.focus();
      return;
    }

    window.location.assign(
      "/auth/google?role=" + encodeURIComponent(role)
    );
  });
});
