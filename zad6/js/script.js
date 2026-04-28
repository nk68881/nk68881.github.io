// Theme toggle
const themeLink = document.getElementById("theme-stylesheet");
const themeBtn = document.getElementById("theme-toggle");
let currentTheme = "red";

themeBtn.addEventListener("click", function () {
  if (currentTheme === "red") {
    themeLink.href = "css/green.css";
    themeBtn.textContent = "Switch to Red Theme";
    currentTheme = "green";
  } else {
    themeLink.href = "css/red.css";
    themeBtn.textContent = "Switch to Green Theme";
    currentTheme = "red";
  }
});

// Show/hide sections
document.querySelectorAll(".toggle-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const content = btn.closest(".section").querySelector(".section-content");
    const hidden = content.style.display === "none";
    content.style.display = hidden ? "" : "none";
    btn.textContent = hidden ? "Hide" : "Show";
  });
});

// Contact form validation
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  function setError(inputId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");
    input.classList.add("input-error");
    error.textContent = message;
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");
    input.classList.remove("input-error");
    error.textContent = "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function containsDigit(value) {
    return /\d/.test(value);
  }

  function validateForm() {
    let valid = true;

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    clearError("first-name");
    clearError("last-name");
    clearError("email");
    clearError("message");

    if (!firstName) {
      setError("first-name", "First name is required.");
      valid = false;
    } else if (containsDigit(firstName)) {
      setError("first-name", "First name must not contain digits.");
      valid = false;
    }

    if (!lastName) {
      setError("last-name", "Last name is required.");
      valid = false;
    } else if (containsDigit(lastName)) {
      setError("last-name", "Last name must not contain digits.");
      valid = false;
    }

    if (!email) {
      setError("email", "Email is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (!message) {
      setError("message", "Message is required.");
      valid = false;
    }

    return valid;
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const successMsg = document.getElementById("form-success");
    successMsg.hidden = true;

    if (validateForm()) {
      contactForm.reset();
      successMsg.hidden = false;
    }
  });
});

// Load dynamic data from JSON
fetch("data/cv-data.json")
.then(function (response) {
  return response.json();
})
.then(function (data) {
  const skillsList = document.getElementById("skills-list");
  data.skills.forEach(function (skill) {
    const li = document.createElement("li");
    li.textContent = skill;
    skillsList.appendChild(li);
  });
  
  const projectsList = document.getElementById("projects-list");
  data.projects.forEach(function (project) {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = project.name;
    li.appendChild(strong);
    li.appendChild(document.createTextNode(" \u2013 " + project.description));
    projectsList.appendChild(li);
  });
})
.catch(function (err) {
    console.error("Failed to load CV data:", err);
  });

console.log("CV page loaded.");