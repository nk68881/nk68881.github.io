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

console.log("CV page loaded.");