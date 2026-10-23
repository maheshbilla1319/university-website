
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. MOBILE NAVIGATION
  // ==========================================

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");

  function closeMenu() {
    if (nav) {
      nav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");
  }

  if (menuToggle && nav) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      nav.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    // Close menu after clicking a navigation link
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close menu on desktop layout
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });

    // Close menu with Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }


  // ==========================================
  // 2. AOS SCROLL ANIMATIONS
  // ==========================================

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
      offset: 80,
      mirror: false,
      disable: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    });
  }


  // ==========================================
  // 3. TESTIMONIAL SLIDER
  // ==========================================

  const slides = Array.from(
    document.querySelectorAll(".testimonial-slide")
  );

  const currentNumber =
    document.querySelector(".current-slide");

  const previousButton =
    document.querySelector(".slider-btn.prev");

  const nextButton =
    document.querySelector(".slider-btn.next");

  let currentIndex = 0;

  function showSlide(index) {
    if (slides.length === 0) return;

    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;

      slide.classList.toggle("active", isActive);
      slide.setAttribute(
        "aria-hidden",
        String(!isActive)
      );
    });

    if (currentNumber) {
      currentNumber.textContent = String(
        currentIndex + 1
      ).padStart(2, "0");
    }
  }

  if (slides.length > 0) {
    showSlide(0);
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      showSlide(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showSlide(currentIndex + 1);
    });
  }


  // ==========================================
  // 4. AUTOMATIC FOOTER YEAR
  // ==========================================

  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ==========================================
  // 5. CONTACT FORM VALIDATION
  // ==========================================

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const formStatus =
      contactForm.querySelector(".form-status");

    function showStatus(message, type) {
      if (!formStatus) return;

      formStatus.textContent = message;
      formStatus.className = "form-status " + type;
      formStatus.setAttribute("role", "status");
      formStatus.setAttribute("aria-live", "polite");
    }

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Read form values
      const name =
        contactForm.elements["name"]?.value.trim() || "";

      const email =
        contactForm.elements["email"]?.value.trim() || "";

      const interest =
        contactForm.elements["interest"]?.value || "";

      const message =
        contactForm.elements["message"]?.value.trim() || "";

      // Check required fields
      if (!name || !email || !interest || !message) {
        showStatus(
          "Please fill in all fields.",
          "error"
        );
        return;
      }

      // Validate email format
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        showStatus(
          "Please enter a valid email address.",
          "error"
        );
        return;
      }

      // Check built-in HTML validation
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();

        showStatus(
          "Please check your form details.",
          "error"
        );
        return;
      }

      // Validation success
      showStatus(
        "Thank you, " + name +
        "! Form validated successfully. Redirecting...",
        "success"
      );

      // Redirect to 404.html
      window.setTimeout(() => {
        window.location.href = "404.html";
      }, 1500);
    });
  }

});
