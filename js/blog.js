
// ========================================
// EDUNOVA BLOG JAVASCRIPT
// Navigation, AOS, Newsletter and Scrolling
// ========================================

document.addEventListener("DOMContentLoaded", function () {

  // ========================================
  // 1. AOS SCROLL ANIMATIONS
  // ========================================

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 65,
      mirror: false,
      disable: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    });
  }


  // ========================================
  // 2. MOBILE NAVIGATION TOGGLE
  // ========================================

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {

    const menuIcon = menuToggle.querySelector("i");

    // Update toggle icon and accessibility attributes
    function updateMenuState(isOpen) {
      mainNav.classList.toggle("open", isOpen);

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
    }

    // Start with menu closed
    updateMenuState(false);

    // Open and close menu on toggle click
    menuToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      updateMenuState(!isOpen);
    });

    // Close menu after selecting a navigation link
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        updateMenuState(false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        updateMenuState(false);
      }
    });

    // Close menu with Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        updateMenuState(false);
      }
    });

    // Close menu when switching to desktop layout
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        updateMenuState(false);
      }
    });

  }


  // ========================================
  // 3. AUTOMATIC COPYRIGHT YEAR
  // ========================================

  const yearElement = document.getElementById("currentYear");

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

    updateBackToTop();

    backToTop.addEventListener("click", function (event) {
      event.preventDefault();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }

/* ========================================
   5. NEWSLETTER FORM VALIDATION
   Validation and redirect to 404.html
======================================== */

const newsletterForm = document.getElementById("newsletterForm");
const formMessage = document.getElementById("formMessage");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = document.getElementById("emailAddress");

    // Clear previous message
    if (formMessage) {
      formMessage.textContent = "";
      formMessage.style.color = "";
    }

    // Validate email input
    if (
      !emailInput ||
      !emailInput.value.trim() ||
      !emailInput.checkValidity()
    ) {
      if (emailInput) {
        emailInput.reportValidity();
      }

      if (formMessage) {
        formMessage.textContent =
          "Please enter a valid email address.";
        formMessage.style.color = "#B42318";
      }

      return;
    }

    // Show success message before redirecting
    if (formMessage) {
      formMessage.textContent =
        "Email validated successfully! Redirecting...";
      formMessage.style.color = "#123D2B";
    }

    // Redirect after successful validation
    setTimeout(function () {
      window.location.href = "404.html";
    }, 1000);
  });
}



  // ========================================
  // 6. SMOOTH SCROLLING FOR PAGE LINKS
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach(
    function (link) {

      link.addEventListener("click", function (event) {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        let target;

        try {
          target = document.querySelector(targetId);
        } catch (error) {
          return;
        }

        if (target) {
          event.preventDefault();

          const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

          target.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
          });
        }
      });
    }
  );


  // ========================================
  // 7. REFRESH AOS AFTER PAGE INITIALIZATION
  // ========================================

  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }

});
