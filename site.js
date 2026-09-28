(() => {
  "use strict";

  const progress = document.querySelector("[data-scroll-progress]");
  const glow = document.querySelector("[data-cursor-glow]");

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? ((window.scrollY / max) * 100).toFixed(2) + "%" : "0%";
  };

  const updateGlow = (event) => {
    if (!glow || window.matchMedia("(pointer: coarse)").matches) return;
    glow.style.opacity = "1";
    glow.style.left = event.clientX + "px";
    glow.style.top = event.clientY + "px";
  };

  const resetGlow = () => {
    if (glow) glow.style.opacity = "0";
  };

  const enableCardMotion = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "perspective(900px) rotateX(" + (-y * 2.4).toFixed(2) + "deg) rotateY(" + (x * 2.8).toFixed(2) + "deg) translateY(-2px)";
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  };

  const bootTerminal = () => {
    const input = document.querySelector("[data-terminal-input]");
    const output = document.querySelector("[data-terminal-output]");
    if (!input || !output) return;

    const commands = {
      help: "commands: status, product, catalog, build, clear",
      status: "systems: operational",
      product: "active product: roblox external",
      catalog: "catalog: 1 live / 6 coming soon",
      build: "storefront build: 2026.09",
      clear: ""
    };

    const write = (line) => {
      const row = document.createElement("div");
      row.className = "terminal-line";
      row.textContent = line;
      output.appendChild(row);
      output.scrollTop = output.scrollHeight;
    };

    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const value = input.value.trim().toLowerCase();
      if (!value) return;
      write("luna@store:~$ " + value);
      if (value === "clear") {
        output.innerHTML = "";
      } else {
        write(commands[value] || "unknown command — type help");
      }
      input.value = "";
    });
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  window.addEventListener("pointermove", updateGlow, { passive: true });
  window.addEventListener("pointerleave", resetGlow);
  updateProgress();
  enableCardMotion();
  bootTerminal();
})();