
/* =========================================
   EDUNOVA UNIVERSITY — SIGNUP JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // 1. AOS animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    });
  }

  // 2. Footer year
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 3. Responsive mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    const menuIcon = menuToggle.querySelector("i");

    function closeMenu() {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");

      if (menuIcon) {
        menuIcon.className = "bi bi-list";
      }
    }

    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      if (menuIcon) {
        menuIcon.className = isOpen ? "bi bi-x-lg" : "bi bi-list";
      }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  // 4. Role selection: show relevant optional ID field
  const roleSelect = document.getElementById("role");
  const studentField = document.getElementById("studentField");
  const employeeField = document.getElementById("employeeField");

  function updateRoleFields() {
    const role = roleSelect.value;

    studentField.hidden = role !== "student";
    employeeField.hidden = !["faculty", "staff"].includes(role);
  }

  roleSelect.addEventListener("change", () => {
    updateRoleFields();
    clearError("role", "roleError");
  });

  updateRoleFields();

  // 5. Show/hide passwords
  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      const icon = button.querySelector("i");

      if (!target || !icon) return;

      const shouldShow = target.type === "password";

      target.type = shouldShow ? "text" : "password";
      button.setAttribute(
        "aria-label",
        shouldShow ? "Hide password" : "Show password"
      );

      icon.className = shouldShow ? "bi bi-eye-slash" : "bi bi-eye";
    });
  });

  // 6. Password strength checker
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");

  function getPasswordStrength(value) {
    if (!value) return { score: 0, label: "Use at least 8 characters." };

    let score = 0;

    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (value.length < 8) {
      return { score: 1, label: "Too short — use at least 8 characters." };
    }

    if (score <= 2) {
      return { score: 2, label: "Weak password" };
    }

    if (score <= 3) {
      return { score: 3, label: "Fair password" };
    }

    if (score === 4) {
      return { score: 4, label: "Good password" };
    }

    return { score: 5, label: "Strong password" };
  }

  function updatePasswordStrength() {
    const result = getPasswordStrength(password.value);
    const widths = ["0%", "20%", "40%", "60%", "80%", "100%"];
    const strengthColors = [
      "transparent",
      "#B42318",
      "#D97706",
      "#C6A15B",
      "#367A48",
      "#205B32"
    ];

    strengthBar.style.width = widths[result.score];
    strengthBar.style.background = strengthColors[result.score];
    strengthText.textContent = result.label;
  }

  password.addEventListener("input", () => {
    updatePasswordStrength();
    clearError("password", "passwordError");

    if (confirmPassword.value) {
      validateConfirmPassword();
    }
  });

  // 7. Form helpers
  const form = document.getElementById("signupForm");
  const formMessage = document.getElementById("formMessage");

  function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (field) field.classList.add("invalid");
    if (error) error.textContent = message;
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (field) field.classList.remove("invalid");
    if (error) error.textContent = "";
  }

  function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message show ${type}`;
  }

  function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
  }

  function validateConfirmPassword() {
    if (!confirmPassword.value) {
      showError(
        "confirmPassword",
        "confirmError",
        "Please confirm your password."
      );
      return false;
    }

    if (password.value !== confirmPassword.value) {
      showError(
        "confirmPassword",
        "confirmError",
        "Passwords do not match."
      );
      return false;
    }

    clearError("confirmPassword", "confirmError");
    return true;
  }

  // Clear field errors while the user corrects them
  [
    ["fullName", "nameError"],
    ["email", "emailError"],
    ["studentId", ""],
    ["employeeId", ""]
  ].forEach(([fieldId, errorId]) => {
    const field = document.getElementById(fieldId);

    if (field) {
      field.addEventListener("input", () => {
        if (errorId) clearError(fieldId, errorId);
        clearFormMessage();
      });
    }
  });

  confirmPassword.addEventListener("input", () => {
    validateConfirmPassword();
    clearFormMessage();
  });

  document.getElementById("terms").addEventListener("change", () => {
    clearError("terms", "termsError");
    clearFormMessage();
  });

  // 8. Validate and submit form
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormMessage();

    let isValid = true;

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const role = document.getElementById("role");
    const terms = document.getElementById("terms");

    // Clear previous errors
    [
      ["fullName", "nameError"],
      ["email", "emailError"],
      ["role", "roleError"],
      ["password", "passwordError"],
      ["confirmPassword", "confirmError"],
      ["terms", "termsError"]
    ].forEach(([fieldId, errorId]) => {
      clearError(fieldId, errorId);
    });

    // Full name
    if (fullName.value.trim().length < 2) {
      showError(
        "fullName",
        "nameError",
        "Please enter your full name."
      );
      isValid = false;
    }

    // Email
    if (!email.validity.valid || !email.value.trim()) {
      showError(
        "email",
        "emailError",
        "Please enter a valid email address."
      );
      isValid = false;
    }

    // Role
    if (!role.value) {
      showError(
        "role",
        "roleError",
        "Please select your role."
      );
      isValid = false;
    }

    // Password length
    if (password.value.length < 8) {
      showError(
        "password",
        "passwordError",
        "Password must contain at least 8 characters."
      );
      isValid = false;
    }

    // Confirm password
    if (!validateConfirmPassword()) {
      isValid = false;
    }

    // Terms and conditions
    if (!terms.checked) {
      showError(
        "terms",
        "termsError",
        "Please agree to the terms before continuing."
      );
      isValid = false;
    }

    if (!isValid) {
      showFormMessage(
        "Please correct the highlighted fields and try again.",
        "error"
      );

      const firstInvalid = form.querySelector(".invalid");

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    /*
      Front-end demonstration only.
      No account is created or data stored.
      Connect this form to a secure backend or
      authentication provider to create real accounts.
    */

    showFormMessage(
      "Form validation successful! Connect your authentication backend to create your account.",
      "success"
    );
  });

});
