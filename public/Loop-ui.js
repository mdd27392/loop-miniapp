// Loop-ui.js
// Handles mantra storage and looping border animation

(function () {
  const STORAGE_KEY = "loop-mantra";

  function loadMantra() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value || typeof value !== "string") return "";
      return value;
    } catch (e) {
      console.warn("Failed to load mantra:", e);
      return "";
    }
  }

  function saveMantra(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      console.warn("Failed to save mantra:", e);
    }
  }

  function updateLengthLabel(el, text) {
    if (!el) return;
    const len = (text || "").length;
    el.textContent = len === 1 ? "1 character" : `${len} characters`;
  }

  function buildLoopStrips(trackEl, mantra) {
    if (!trackEl) return;
    trackEl.innerHTML = "";
    if (!mantra) return;

    const repeated = Array(10).fill(null).map(() => mantra).join(" · ");
    const strips = [
      { className: "loop-strip top" },
      { className: "loop-strip bottom" },
      { className: "loop-strip left" },
      { className: "loop-strip right" }
    ];

    strips.forEach((spec) => {
      const div = document.createElement("div");
      div.className = spec.className;
      const span = document.createElement("span");
      span.innerHTML = `<span class="mantra">${mantra}</span>` + (" · " + mantra).repeat(12);
      div.appendChild(span);
      trackEl.appendChild(div);
    });
  }

  function initLoop() {
    const input = document.getElementById("mantra-input");
    const saveBtn = document.getElementById("save-btn");
    const loopTrack = document.getElementById("loop-track");
    const centerText = document.getElementById("loop-center-text");
    const dateLabel = document.getElementById("date-label");
    const lengthLabel = document.getElementById("length-label");
    const statusLabel = document.getElementById("status-label");

    if (!input || !saveBtn || !loopTrack) {
      console.warn("Loop UI elements missing");
      return;
    }

    const stored = loadMantra();
    if (stored) {
      input.value = stored;
      buildLoopStrips(loopTrack, stored);
      if (centerText) {
        centerText.textContent = stored;
      }
      if (statusLabel) {
        statusLabel.textContent = "Loop active";
      }
    }

    updateLengthLabel(lengthLabel, stored);

    if (dateLabel) {
      dateLabel.textContent = stored ? "Saved locally" : "Not saved yet";
    }

    input.addEventListener("input", () => {
      updateLengthLabel(lengthLabel, input.value.trim());
    });

    function applyMantra() {
      const value = input.value.trim();
      saveMantra(value);
      buildLoopStrips(loopTrack, value);
      if (centerText) {
        centerText.textContent = value || "Your words will orbit around this frame.";
      }
      if (statusLabel) {
        statusLabel.textContent = value ? "Loop updated" : "Not set yet";
      }
      if (dateLabel) {
        dateLabel.textContent = value ? "Saved locally" : "Not saved yet";
      }
    }

    saveBtn.addEventListener("click", applyMantra);
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        applyMantra();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLoop);
  } else {
    initLoop();
  }
})();
