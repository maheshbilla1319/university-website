
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

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");
  const menuToggle = $("#menuToggle");
  const toast = $("#toastMessage");

  // Footer year
  $("#footerYear").textContent = new Date().getFullYear();

  // Date display
  $("#todayDate").innerHTML =
    '<i class="bi bi-calendar3"></i> ' +
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

  // Toast notification
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // Mobile slide menu
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

      const dialog = $("#courseDialog");
      if (dialog.open) dialog.close();
    }
  });

  // Dashboard section navigation
  const allSections = $$(".dashboard-section");
  const navLinks = $$(".nav-link");
  const sectionLinks = $$("[data-section]");
  const pageTitle = $("#pageTitle");
  const currentPageName = $("#currentPageName");

  function activateSection(sectionId, shouldScroll = true) {
    const target = document.getElementById(sectionId);

    if (!target || !target.classList.contains("dashboard-section")) {
      showToast("This dashboard section is not available.");
      return;
    }

    // Display only the selected section.
    allSections.forEach((section) => {
      section.hidden = section !== target;
    });

    // Update sidebar active state.
    navLinks.forEach((link) => {
      const active = link.dataset.section === sectionId;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const title = target.dataset.pageTitle || "Overview";

    pageTitle.textContent =
      sectionId === "overview" ? "Faculty Dashboard" : title;

    currentPageName.textContent = title;

    closeSidebar();

    // Keep URL hash in sync with the active section.
    if (window.location.hash !== "#" + sectionId) {
      history.replaceState(null, "", "#" + sectionId);
    }

    if (shouldScroll) {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth"
      });
    }

    // Refresh AOS for newly revealed elements.
    if (window.AOS) {
      AOS.refreshHard();
    }

    // Reset search after changing sections.
    const search = $("#dashboardSearch");
    if (search.value) {
      search.value = "";
      filterSearch("");
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

  // Open the section specified in the URL, if valid.
  const initialSection = window.location.hash.slice(1);

  if (
    initialSection &&
    document.getElementById(initialSection)?.classList.contains("dashboard-section")
  ) {
    activateSection(initialSection, false);
  } else {
    activateSection("overview", false);
  }

  // Profile shortcut
  $("#profileShortcut").addEventListener("click", () => {
    activateSection("profile");
  });

  // Optional authenticated profile API.
  // If no backend exists, the sample profile stays visible.
  async function loadFacultyProfile() {
    try {
      const response = await fetch("/api/faculty/profile", {
        credentials: "same-origin",
        headers: { Accept: "application/json" }
      });

      if (!response.ok) return;

      const faculty = await response.json();

      if (typeof faculty.name === "string" && faculty.name.trim()) {
        const fullName = faculty.name.trim();
        const firstName = fullName.split(/\s+/)[1] || fullName.split(/\s+/)[0];

        $("#sidebarFacultyName").textContent = fullName;
        $("#topFacultyName").textContent = fullName;
        $("#profileFacultyName").textContent = fullName;
        $("#welcomeName").textContent = firstName;
      }

      if (typeof faculty.email === "string") {
        $("#profileEmail").textContent = faculty.email;
      }
    } catch {
      // The static demo can run without a profile API.
    }
  }

  loadFacultyProfile();

  // Dashboard search: searches content in the current section.
  const searchInput = $("#dashboardSearch");

  function filterSearch(query) {
    const activeSection = allSections.find((section) => !section.hidden);
    if (!activeSection) return;

    const searchableItems = $$(".searchable", activeSection);
    let matches = 0;

    searchableItems.forEach((item) => {
      const found = item.textContent.toLowerCase().includes(query);
      item.hidden = !found;

      if (found) matches++;
    });

    let emptyMessage = $(".search-empty", activeSection);

    if (!emptyMessage) {
      emptyMessage = document.createElement("p");
      emptyMessage.className = "search-empty";
      emptyMessage.textContent = "No matching results found.";
      activeSection.appendChild(emptyMessage);
    }

    emptyMessage.hidden = !query || matches > 0;
  }

  searchInput.addEventListener("input", () => {
    filterSearch(searchInput.value.trim().toLowerCase());
  });

  // Course details dialog
  const dialog = $("#courseDialog");
  const dialogTitle = $("#dialogCourseTitle");

  $$("[data-open-course]").forEach((button) => {
    button.addEventListener("click", () => {
      dialogTitle.textContent = button.dataset.openCourse;

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        showToast("Course: " + button.dataset.openCourse);
      }
    });
  });

  $("#closeCourseDialog").addEventListener("click", () => {
    dialog.close();
  });

  $("#dialogOk").addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  // Attendance demo interaction.
  // This does not save official attendance records.
  $$(".attendance-action").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(
        "Attendance register opened for " +
        button.dataset.class +
        ". Connect your attendance API to save records."
      );
    });
  });

  // Assignment review demo interaction.
  // Real submissions and marks require a backend.
  $$(".review-action").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(
        "Review selected: " +
        button.dataset.task +
        ". Connect your assignment API to evaluate submissions."
      );
    });
  });

  // Mark a message as read in the current browser view.
  $$(".message-action").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "Read";
      button.disabled = true;
      button.setAttribute("aria-label", "Message marked read");
      showToast(button.dataset.message + " message marked as read in this demo.");
    });
  });

  // Notifications
  $("#notificationButton").addEventListener("click", () => {
    showToast(
      "Faculty updates: 8 assignments pending review and 3 messages to check."
    );
  });

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
