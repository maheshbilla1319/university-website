
document.addEventListener("DOMContentLoaded", () => {
  // AOS animations
  if (window.AOS) {
    AOS.init({
      duration: 750,
      once: true,
      offset: 35,
      easing: "ease-out-cubic"
    });
  }

  // Footer year and today's date
  const year = document.getElementById("footerYear");
  if (year) year.textContent = new Date().getFullYear();

  const todayDate = document.getElementById("todayDate");
  if (todayDate) {
    todayDate.innerHTML =
      '<i class="bi bi-calendar-event"></i> ' +
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
  }

  // Optional student details supplied by your authenticated server.
  // Never trust URL parameters or user-editable values for identity.
  async function loadStudentProfile() {
    try {
      const response = await fetch("/api/student/profile", {
        credentials: "same-origin"
      });

      if (!response.ok) return;

      const student = await response.json();

      if (typeof student.name === "string" && student.name.trim()) {
        const name = student.name.trim();

        document.getElementById("sidebarStudentName").textContent = name;
        document.getElementById("topbarStudentName").textContent = name;
        document.getElementById("profileStudentName").textContent = name;
        document.getElementById("welcomeStudentName").textContent =
          name.split(/\s+/)[0];
      }

      if (typeof student.email === "string") {
        document.getElementById("profileEmail").textContent = student.email;
      }
    } catch {
      // Keep the sample profile if the profile API is not available.
    }
  }

  loadStudentProfile();

  // Sidebar slide menu
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", () => {
    sidebar.classList.contains("open")
      ? closeSidebar()
      : openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();

      const dialog = document.getElementById("courseDialog");
      if (dialog.open) dialog.close();
    }
  });

  // Navigate to dashboard sections
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionLinks = document.querySelectorAll("[data-section]");
  const pageTitle = document.getElementById("topbarTitle");
  const currentPageName = document.getElementById("currentPageName");

  function activateSection(sectionId, shouldScroll = true) {
    const target = document.getElementById(sectionId);

    if (!target) {
      showToast("This section is not available.");
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.dataset.section === sectionId
      );
    });

    const title =
      target.dataset.pageTitle ||
      (sectionId === "overview" ? "Overview" : sectionId);

    pageTitle.textContent = sectionId === "overview" ? "Dashboard" : title;
    currentPageName.textContent = title;

    if (shouldScroll) {
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    }

    closeSidebar();

    if (window.location.hash !== "#" + sectionId) {
      history.replaceState(null, "", "#" + sectionId);
    }
  }

  sectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const sectionId = link.dataset.section;

      if (!sectionId) return;

      event.preventDefault();
      activateSection(sectionId);
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      activateSection(link.dataset.section);
    });
  });

  // Support direct links such as student-dashboard.html#results
  const initialSection = window.location.hash.slice(1);

  if (initialSection && document.getElementById(initialSection)) {
    activateSection(initialSection, false);
  }

  // Profile shortcut
  document.getElementById("profileShortcut").addEventListener("click", () => {
    activateSection("profile");
  });

  // Search course cards
  const searchInput = document.getElementById("dashboardSearch");
  const courseGrid = document.querySelector(".course-grid");
  const courseCards = Array.from(
    document.querySelectorAll(".course-card")
  );

  const emptySearch = document.createElement("p");
  emptySearch.className = "search-empty";
  emptySearch.textContent = "No courses match your search.";
  emptySearch.hidden = true;
  courseGrid.appendChild(emptySearch);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    courseCards.forEach((card) => {
      const matches = card.textContent.toLowerCase().includes(query);

      card.hidden = !matches;

      if (matches) visibleCount++;
    });

    emptySearch.hidden = visibleCount > 0;
  });

  // Course details dialog
  const courseDialog = document.getElementById("courseDialog");
  const dialogTitle = document.getElementById("dialogCourseTitle");

  document.querySelectorAll("[data-open-course]").forEach((button) => {
    button.addEventListener("click", () => {
      dialogTitle.textContent = button.dataset.openCourse;

      if (typeof courseDialog.showModal === "function") {
        courseDialog.showModal();
      } else {
        showToast("Your browser does not support this course dialog.");
      }
    });
  });

  document.getElementById("closeCourseDialog").addEventListener("click", () => {
    courseDialog.close();
  });

  document.getElementById("dialogOk").addEventListener("click", () => {
    courseDialog.close();
  });

  courseDialog.addEventListener("click", (event) => {
    if (event.target === courseDialog) courseDialog.close();
  });

  // Notifications
  document.getElementById("notificationButton").addEventListener("click", () => {
    showToast("You have 3 pending assignments and 2 campus announcements.");
  });

  // Toast message
  let toastTimer;

  function showToast(message) {
    const toast = document.getElementById("toastMessage");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  // Logout
  document.getElementById("logoutButton").addEventListener("click", async () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out of EduNova?"
    );

    if (!confirmed) return;

    const logoutButton = document.getElementById("logoutButton");
    logoutButton.disabled = true;

    try {
      // Your backend must destroy the authenticated server session.
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch {
      // A static front-end cannot end a server session by itself.
    } finally {
      // Return to the login screen.
      // The server must still enforce authentication on protected pages.
      window.location.replace("login.html");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const supportLink = document.querySelector(
    '.help-card a[data-section="support"]'
  );

  if (supportLink) {
    supportLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "404.html";
    });
  }
});
