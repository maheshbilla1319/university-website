
/* =========================================
   EDUNOVA UNIVERSITY — LOGIN JS
   Student & Faculty Dashboard Redirect
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // 1. AOS animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 850,
      once: true,
      offset: 50,
      easing: "ease-out-cubic",
      disable: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    });
  }

  // 2. Footer year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // 3. Login elements
  const loginForm = document.getElementById("loginForm");
  const roleInput = document.getElementById("role");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginButton = document.getElementById("loginButton");
  const formMessage = document.getElementById("formMessage");

  if (
    !loginForm ||
    !roleInput ||
    !emailInput ||
    !passwordInput ||
    !loginButton ||
    !formMessage
  ) {
    console.error("Login form elements are missing.");
    return;
  }

  // 4. Dashboard filenames
  const dashboards = {
    student: "student.html",
    faculty: "faculty.html"
  };

  // 5. Prefill email after signup
  try {
    const savedEmail = sessionStorage.getItem(
      "edunovaLoginEmail"
    );

    if (savedEmail) {
      emailInput.value = savedEmail;
      sessionStorage.removeItem("edunovaLoginEmail");
    }
  } catch (error) {
    console.warn("Unable to prefill email.", error);
  }

  // 6. Show / hide password
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const show = passwordInput.type === "password";

      passwordInput.type = show ? "text" : "password";

      togglePassword.innerHTML = show
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';

      togglePassword.setAttribute(
        "aria-label",
        show ? "Hide password" : "Show password"
      );
    });
  }

  // 7. Show messages
  function showMessage(message, type = "error") {
    formMessage.textContent = message;
    formMessage.className = `form-message show ${type}`;
    formMessage.setAttribute("role", "status");
  }

  function hideMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
  }

  // 8. Field errors
  function clearError(fieldName) {
    const field = document.getElementById(fieldName);
    const error = document.getElementById(fieldName + "Error");

    if (field) {
      field.classList.remove("invalid");
      field.removeAttribute("aria-invalid");
    }

    if (error) {
      error.textContent = "";
    }
  }

  function setError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const error = document.getElementById(fieldName + "Error");

    if (field) {
      field.classList.add("invalid");
      field.setAttribute("aria-invalid", "true");
    }

    if (error) {
      error.textContent = message;
    }
  }

  ["role", "email", "password"].forEach((fieldName) => {
    const field = document.getElementById(fieldName);

    if (field) {
      field.addEventListener("input", () => {
        clearError(fieldName);
        hideMessage();
      });

      field.addEventListener("change", () => {
        clearError(fieldName);
        hideMessage();
      });
    }
  });

  // 9. Validate login form
  function validateForm() {
    let valid = true;

    const role = roleInput.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    ["role", "email", "password"].forEach(clearError);

    // Role validation
    if (!Object.prototype.hasOwnProperty.call(dashboards, role)) {
      setError("role", "Please select Student or Faculty.");
      valid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("email", "Please enter your email address.");
      valid = false;
    } else if (!emailPattern.test(email)) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    }

    // Password validation
    if (!password.trim()) {
      setError("password", "Please enter your password.");
      valid = false;
    }

    return valid;
  }

  // 10. Sign in
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hideMessage();

    if (!validateForm()) {
      showMessage("Please correct the highlighted fields.");

      const firstInvalid = loginForm.querySelector(".invalid");

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    // Frontend DEMO ONLY.
    // This checks that fields are filled, not that credentials are real.
    const role = roleInput.value;
    const dashboard = dashboards[role];

    showMessage(
      "Sign in successful! Opening your dashboard...",
      "success"
    );

    loginButton.disabled = true;

    loginButton.innerHTML =
      '<span>Opening dashboard...</span>' +
      '<i class="bi bi-arrow-repeat"></i>';

    // Redirect to selected dashboard
    window.setTimeout(() => {
      window.location.href = dashboard;
    }, 600);
  });

});
