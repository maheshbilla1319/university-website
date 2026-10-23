
/* =========================================
   EDUNOVA UNIVERSITY — SIGNUP JS
   Validation, Password Strength & Login Redirect
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

  // 3. Mobile navigation
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
        menuIcon.className = isOpen
          ? "bi bi-x-lg"
          : "bi bi-list";
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

  // 4. Get form elements
  const form = document.getElementById("signupForm");
  const formMessage = document.getElementById("formMessage");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const roleSelect = document.getElementById("role");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const terms = document.getElementById("terms");

  const studentField = document.getElementById("studentField");
  const employeeField = document.getElementById("employeeField");

  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");

  // Stop safely if required signup HTML is missing
  if (
    !form ||
    !fullName ||
    !email ||
    !roleSelect ||
    !password ||
    !confirmPassword ||
    !terms
  ) {
    console.error("EduNova signup form elements are missing.");
    return;
  }

  // 5. Show role-specific fields
  function updateRoleFields() {
    const selectedRole = roleSelect.value;

    if (studentField) {
      studentField.hidden = selectedRole !== "student";
    }

    if (employeeField) {
      employeeField.hidden = !["faculty", "staff"].includes(
        selectedRole
      );
    }
  }

  roleSelect.addEventListener("change", () => {
    updateRoleFields();
    clearError("role", "roleError");
    clearFormMessage();
  });

  updateRoleFields();

  // 6. Show / hide passwords
  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);

      if (!target) return;

      const showPassword = target.type === "password";
      target.type = showPassword ? "text" : "password";

      button.setAttribute(
        "aria-label",
        showPassword ? "Hide password" : "Show password"
      );

      const icon = button.querySelector("i");

      if (icon) {
        icon.className = showPassword
          ? "bi bi-eye-slash"
          : "bi bi-eye";
      }
    });
  });

  // 7. Password strength checker
  function getPasswordStrength(value) {
    if (!value) {
      return {
        score: 0,
        label: "Use at least 8 characters."
      };
    }

    let score = 0;

    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (value.length < 8) {
      return {
        score: 1,
        label: "Too short — use at least 8 characters."
      };
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
    if (!strengthBar || !strengthText) return;

    const result = getPasswordStrength(password.value);

    const widths = [
      "0%",
      "20%",
      "40%",
      "60%",
      "80%",
      "100%"
    ];

    const colors = [
      "transparent",
      "#B42318",
      "#D97706",
      "#C6A15B",
      "#367A48",
      "#205B32"
    ];

    strengthBar.style.width = widths[result.score];
    strengthBar.style.backgroundColor = colors[result.score];
    strengthText.textContent = result.label;
  }

  password.addEventListener("input", () => {
    updatePasswordStrength();
    clearError("password", "passwordError");
    clearFormMessage();

    if (confirmPassword.value) {
      validateConfirmPassword();
    }
  });

  // 8. Form message helpers
  function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (field) {
      field.classList.add("invalid");
      field.setAttribute("aria-invalid", "true");
    }

    if (error) {
      error.textContent = message;
    }
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (field) {
      field.classList.remove("invalid");
      field.removeAttribute("aria-invalid");
    }

    if (error) {
      error.textContent = "";
    }
  }

  function showFormMessage(message, type) {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `form-message show ${type}`;
    formMessage.setAttribute("role", "status");
  }

  function clearFormMessage() {
    if (!formMessage) return;

    formMessage.textContent = "";
    formMessage.className = "form-message";
  }

  // 9. Confirm password validation
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

  // 10. Clear errors when fields change
  [
    ["fullName", "nameError"],
    ["email", "emailError"],
    ["studentId", "studentIdError"],
    ["employeeId", "employeeIdError"]
  ].forEach(([fieldId, errorId]) => {
    const field = document.getElementById(fieldId);

    if (field) {
      field.addEventListener("input", () => {
        if (errorId && document.getElementById(errorId)) {
          clearError(fieldId, errorId);
        }

        clearFormMessage();
      });
    }
  });

  confirmPassword.addEventListener("input", () => {
    validateConfirmPassword();
    clearFormMessage();
  });

  terms.addEventListener("change", () => {
    clearError("terms", "termsError");
    clearFormMessage();
  });

  // 11. Signup form validation and redirect
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormMessage();

    let isValid = true;

    // Clear old errors
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

    // Validate name
    if (fullName.value.trim().length < 2) {
      showError(
        "fullName",
        "nameError",
        "Please enter your full name."
      );

      isValid = false;
    }

    // Validate email
    if (
      !email.value.trim() ||
      !email.validity.valid
    ) {
      showError(
        "email",
        "emailError",
        "Please enter a valid email address."
      );

      isValid = false;
    }

    // Validate role
    if (!roleSelect.value) {
      showError(
        "role",
        "roleError",
        "Please select your role."
      );

      isValid = false;
    }

    // Validate password
    if (password.value.length < 8) {
      showError(
        "password",
        "passwordError",
        "Password must contain at least 8 characters."
      );

      isValid = false;
    }

    // Validate confirm password
    if (!validateConfirmPassword()) {
      isValid = false;
    }

    // Validate terms
    if (!terms.checked) {
      showError(
        "terms",
        "termsError",
        "Please agree to the terms before continuing."
      );

      isValid = false;
    }

    // Show errors if validation fails
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

    // 12. Save signup details for the demo login page
    // Demo only: localStorage is not secure authentication.
    const signupData = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      role: roleSelect.value
    };

    try {
      localStorage.setItem(
        "edunovaSignup",
        JSON.stringify(signupData)
      );

      // Prefill the email on login.html
      sessionStorage.setItem(
        "edunovaLoginEmail",
        signupData.email
      );
    } catch (error) {
      console.error("Could not save demo signup details:", error);
    }

    // 13. Show success message
    showFormMessage(
      "Account details validated successfully! Redirecting to login...",
      "success"
    );

    // Prevent repeat submissions during redirect
    const submitButton = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    // 14. Redirect to login.html
    window.setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  });

});
