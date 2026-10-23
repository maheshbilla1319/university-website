
/* ========================================
   EDUNOVA UNIVERSITY — CONTACT PAGE JS
======================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 1. SCROLL ANIMATIONS (AOS)
  // ========================================

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 70,
      mirror: false,
      disable: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    });
  }


  // ========================================
  // 2. MOBILE NAVIGATION
  // ========================================

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    const menuIcon = menuToggle.querySelector("i");

    function closeMenu() {
      mainNav.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );

      if (menuIcon) {
        menuIcon.className = "bi bi-list";
      }
    }

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

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

    // Close menu after clicking a navigation link
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu using Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close menu on desktop screens
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }


  // ========================================
  // 3. AUTOMATIC COPYRIGHT YEAR
  // ========================================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ========================================
  // 4. BACK-TO-TOP BUTTON
  // ========================================

  const backToTop = document.getElementById("backToTop");

  if (backToTop) {

    function updateBackToTop() {
      backToTop.classList.toggle(
        "visible",
        window.scrollY > 400
      );
    }

    window.addEventListener(
      "scroll",
      updateBackToTop,
      { passive: true }
    );

    // Set initial visibility
    updateBackToTop();

    // Scroll smoothly to the top
    backToTop.addEventListener("click", () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }


  // ========================================
  // 5. DEPARTMENT ENQUIRY PRESELECTION
  // ========================================

  const enquiryType = document.getElementById("enquiryType");

  document.querySelectorAll("[data-enquiry]").forEach((link) => {
    link.addEventListener("click", () => {

      if (enquiryType) {
        enquiryType.value = link.dataset.enquiry;

        // Validate that the requested option exists
        if (enquiryType.value !== link.dataset.enquiry) {
          return;
        }
      }
    });
  });


  // ========================================
  // 6. CONTACT FORM VALIDATION
  // ========================================

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Reset previous status
      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }

      // Check required fields and input formats
      if (!contactForm.checkValidity()) {

        contactForm.reportValidity();

        if (formStatus) {
          formStatus.textContent =
            "Please complete all required fields correctly.";

          formStatus.classList.add("error");
        }

        return;
      }

      // Get visitor name if available
      const nameField = contactForm.elements.namedItem("name");

      const visitorName =
        nameField && "value" in nameField
          ? nameField.value.trim()
          : "";

      // Show successful validation message
      if (formStatus) {
        formStatus.textContent = visitorName
          ? `Thank you, ${visitorName}! Redirecting to the 404 page...`
          : "Form validated successfully! Redirecting to the 404 page...";

        formStatus.classList.add("success");
      }

      // Prevent repeated submissions while waiting
      const submitButton = contactForm.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (submitButton) {
        submitButton.disabled = true;
      }

      // Redirect to 404.html after 1.5 seconds
      window.setTimeout(() => {
        window.location.href = "404.html";
      }, 1500);
    });
  }


  // ========================================
  // 7. FAQ ACCESSIBILITY
  // ========================================

  // Native <details> and <summary> elements
  // handle FAQ opening and closing automatically.
  // No additional JavaScript is required.

});
