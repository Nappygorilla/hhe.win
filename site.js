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



  const syncActiveNavigation = () => {
    const current = (window.location.pathname.split("/").pop() || "index.html").split("#")[0] || "index.html";
    document.querySelectorAll(".mainnav a, .mobile-menu-panel a").forEach((link) => {
      const raw = link.getAttribute("href") || "";
      const target = raw.split("#")[0].split("/").pop() || "index.html";
      const isNavPage = /^(index|features|browser-games|store|about|updates|faq|contact|login|register|key|account|status|legal|privacy|terms|roblox)\.html$/i.test(target);
      if (!isNavPage) return;
      link.classList.toggle("active", target.toLowerCase() === current.toLowerCase());
      link.toggleAttribute("aria-current", target.toLowerCase() === current.toLowerCase());
    });
  };

  const initStoreFilters = () => {
    const grid = document.querySelector("[data-store-grid]");
    if (!grid) return;
    const controls = document.querySelectorAll("[data-store-filter]");
    const search = document.querySelector("[data-store-search]");
    const count = document.querySelector("[data-store-count]");
    const cards = Array.from(grid.querySelectorAll("[data-category]"));
    let active = "all";

    const render = () => {
      const query = (search?.value || "").trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const matchesCategory = active === "all" || card.dataset.category === active;
        const haystack = (card.textContent || "").toLowerCase();
        const matchesQuery = !query || haystack.includes(query);
        const show = matchesCategory && matchesQuery;
        card.hidden = !show;
        if (show) visible++;
      });
      if (count) count.textContent = String(visible).padStart(2, "0") + " PRODUCTS SHOWN";
    };

    controls.forEach((control) => {
      control.addEventListener("click", () => {
        active = control.dataset.storeFilter || "all";
        controls.forEach((item) => {
          const selected = item === control;
          item.classList.toggle("active", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
        render();
      });
    });

    search?.addEventListener("input", render);
    render();
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  window.addEventListener("pointermove", updateGlow, { passive: true });
  window.addEventListener("pointerleave", resetGlow);
  updateProgress();
  enableCardMotion();
  bootTerminal();
  syncActiveNavigation();
  initStoreFilters();
})();