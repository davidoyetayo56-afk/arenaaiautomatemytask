/* Automate My Task — interactions & live demo animations */

(() => {
  "use strict";

  // ---------- Theme ----------
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("amt-theme");
  if (storedTheme) {
    root.setAttribute("data-theme", storedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    if (next === "dark") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "light");
    localStorage.setItem("amt-theme", next === "dark" ? "dark" : "light");
  });

  // ---------- Nav ----------
  const nav = document.getElementById("nav");
  const burger = document.getElementById("navBurger");
  const mobile = document.getElementById("navMobile");

  const onScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger?.addEventListener("click", () => {
    const open = mobile?.hasAttribute("hidden");
    if (open) {
      mobile.removeAttribute("hidden");
      burger.setAttribute("aria-expanded", "true");
    } else {
      mobile.setAttribute("hidden", "");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  mobile?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobile.setAttribute("hidden", "");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  // ---------- Year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // ---------- Stat counters ----------
  const stats = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.getAttribute("data-count")) || 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && stats.length) {
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            sio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach((s) => sio.observe(s));
  } else {
    stats.forEach(animateCount);
  }

  // ---------- Example tabs ----------
  const tabs = document.querySelectorAll(".tab");
  const cards = document.querySelectorAll(".example-card");

  const showCategory = (cat) => {
    tabs.forEach((t) => {
      const active = t.dataset.tab === cat;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    cards.forEach((c) => {
      const match = c.dataset.category === cat;
      if (match) c.removeAttribute("hidden");
      else c.setAttribute("hidden", "");
    });
    // Restart visible animations so they feel fresh
    cards.forEach((c) => {
      if (c.dataset.category === cat) {
        const id = c.dataset.example;
        if (id) restartAnim(id);
      }
    });
    startStepCycles(cat);
  };

  tabs.forEach((t) => {
    t.addEventListener("click", () => showCategory(t.dataset.tab));
  });

  // ---------- Step list cycling (syncs with CSS loops) ----------
  const stepTimers = new Map();

  const cycleSteps = (exampleId, periodMs = 5000) => {
    const list = document.querySelector(`.step-list[data-steps="${exampleId}"]`);
    if (!list) return;
    const items = [...list.querySelectorAll("li")];
    if (!items.length) return;

    let i = 0;
    const apply = () => {
      items.forEach((li, idx) => {
        li.classList.remove("active", "done");
        if (idx < i) li.classList.add("done");
        if (idx === i) li.classList.add("active");
      });
      i = (i + 1) % items.length;
    };
    apply();
    const slice = periodMs / items.length;
    const timer = setInterval(apply, slice);
    stepTimers.set(exampleId, timer);
  };

  const clearStepTimers = () => {
    stepTimers.forEach((t) => clearInterval(t));
    stepTimers.clear();
  };

  const startStepCycles = (cat) => {
    clearStepTimers();
    cards.forEach((c) => {
      if (c.dataset.category === cat && c.dataset.example) {
        cycleSteps(c.dataset.example);
      }
    });
  };

  // ---------- Replay animation ----------
  function restartAnim(id) {
    const el = document.getElementById(`anim-${id}`);
    if (!el) return;
    el.classList.remove("restart");
    // force reflow
    void el.offsetWidth;
    el.classList.add("restart");
    void el.offsetWidth;
    el.classList.remove("restart");

    // reset step list
    const list = document.querySelector(`.step-list[data-steps="${id}"]`);
    if (list) {
      list.querySelectorAll("li").forEach((li, idx) => {
        li.classList.toggle("active", idx === 0);
        li.classList.remove("done");
      });
    }
    // restart step cycle for this one
    if (stepTimers.has(id)) {
      clearInterval(stepTimers.get(id));
      stepTimers.delete(id);
    }
    cycleSteps(id);
  }

  document.querySelectorAll("[data-replay]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-replay");
      if (id) restartAnim(id);
      btn.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: "rotate(-20deg)" },
          { transform: "rotate(0deg)" },
        ],
        { duration: 300, easing: "ease-out" }
      );
    });
  });

  // Kick off default category
  startStepCycles("email");

  // Update folder counts in sort animation periodically
  const bumpFolderCounts = () => {
    const docs = document.querySelector(".c-docs");
    const media = document.querySelector(".c-media");
    const other = document.querySelector(".c-other");
    if (!docs) return;
    const cycle = () => {
      setTimeout(() => { if (docs) docs.textContent = "2"; }, 3200);
      setTimeout(() => { if (media) media.textContent = "1"; }, 3400);
      setTimeout(() => { if (other) other.textContent = "2"; }, 3600);
      setTimeout(() => {
        if (docs) docs.textContent = "0";
        if (media) media.textContent = "0";
        if (other) other.textContent = "0";
      }, 5200);
    };
    cycle();
    setInterval(cycle, 5500);
  };
  bumpFolderCounts();

  // ---------- Interactive task runner ----------
  const input = document.getElementById("taskInput");
  const runBtn = document.getElementById("runTask");
  const output = document.getElementById("tryOutput");
  const status = document.getElementById("tryStatus");
  const chips = document.querySelectorAll(".chip");

  const PLAN_LIBRARY = [
    {
      match: /slack|pr|pull request|digest|morning/i,
      title: "Slack morning PR digest",
      steps: [
        { name: "Schedule trigger", detail: "Cron · every weekday at 09:00" },
        { name: "Fetch open PRs", detail: "GitHub API · repos you watch" },
        { name: "Summarize with AI", detail: "Group by urgency & author" },
        { name: "Post to Slack", detail: "Channel #engineering · rich blocks" },
      ],
    },
    {
      match: /download|sort|folder|file|rename/i,
      title: "Nightly download organizer",
      steps: [
        { name: "Watch folder", detail: "~/Downloads · new files only" },
        { name: "Detect type", detail: "MIME + extension heuristics" },
        { name: "Rename by rules", detail: "date-prefix · clean spaces" },
        { name: "Move into folders", detail: "Docs / Media / Archives / Other" },
      ],
    },
    {
      match: /scrape|price|competitor|csv|drive/i,
      title: "Weekly competitor price watch",
      steps: [
        { name: "Open product pages", detail: "3 URLs · headless browser" },
        { name: "Extract prices", detail: "CSS selectors + fallbacks" },
        { name: "Write CSV", detail: "timestamp · sku · price · delta" },
        { name: "Upload & alert", detail: "Google Drive + Slack if Δ > 5%" },
      ],
    },
    {
      match: /support|ticket|billing|reply|auto-?reply/i,
      title: "Billing support auto-reply",
      steps: [
        { name: "Watch inbox tag", detail: "label:billing · unread only" },
        { name: "Classify intent", detail: "AI · refund / invoice / other" },
        { name: "Draft reply", detail: "Template + personalization" },
        { name: "Send or queue", detail: "Auto-send if confidence ≥ 0.9" },
      ],
    },
    {
      match: /email|inbox|gmail|mail/i,
      title: "Smart inbox triage",
      steps: [
        { name: "Poll new mail", detail: "IMAP / Gmail push" },
        { name: "Classify with AI", detail: "invoice · lead · noise · urgent" },
        { name: "Apply labels", detail: "Nested Gmail labels" },
        { name: "Archive noise", detail: "Keep inbox under 20 unread" },
      ],
    },
    {
      match: /onboard|hire|new hire|welcome/i,
      title: "New-hire onboarding flow",
      steps: [
        { name: "HR trigger", detail: "Webhook when person is added" },
        { name: "Provision accounts", detail: "Email · Slack · tools SSO" },
        { name: "Invite channels", detail: "Team + company-wide" },
        { name: "Send welcome kit", detail: "Docs · calendar 1:1s · checklist" },
      ],
    },
    {
      match: /standup|async|update|status/i,
      title: "Async standup collector",
      steps: [
        { name: "DM the team", detail: "Weekdays 09:45 · bot prompt" },
        { name: "Parse replies", detail: "done · doing · blocked" },
        { name: "Build board", detail: "Group by status columns" },
        { name: "Post summary", detail: "Channel #standup · 10:00" },
      ],
    },
    {
      match: /webhook|crm|lead|form/i,
      title: "Form webhook → CRM",
      steps: [
        { name: "Receive webhook", detail: "POST /hooks/leads" },
        { name: "Normalize fields", detail: "Map name · email · company" },
        { name: "Enrich with AI", detail: "Industry guess · lead score" },
        { name: "Push to CRM", detail: "Create contact · assign owner" },
      ],
    },
  ];

  const DEFAULT_PLAN = {
    title: "Custom automation plan",
    steps: [
      { name: "Parse your request", detail: "Extract trigger, apps, and outcome" },
      { name: "Choose connectors", detail: "Match tools you already use" },
      { name: "Build step graph", detail: "Ordered actions with retries" },
      { name: "Dry-run & activate", detail: "Preview once, then go live" },
    ],
  };

  function pickPlan(text) {
    const t = text.trim();
    for (const p of PLAN_LIBRARY) {
      if (p.match.test(t)) return p;
    }
    return { ...DEFAULT_PLAN, title: t.length > 42 ? t.slice(0, 42) + "…" : t || DEFAULT_PLAN.title };
  }

  function setRunningUI(running) {
    const label = runBtn?.querySelector(".btn-label");
    const spinner = runBtn?.querySelector(".btn-spinner");
    if (running) {
      status.textContent = "Building…";
      status.classList.add("running");
      status.classList.remove("done");
      if (label) label.hidden = true;
      if (spinner) spinner.hidden = false;
      runBtn.disabled = true;
    } else {
      if (label) label.hidden = false;
      if (spinner) spinner.hidden = true;
      runBtn.disabled = false;
    }
  }

  let runToken = 0;

  async function runAutomation(text) {
    const token = ++runToken;
    const plan = pickPlan(text || "custom task");
    setRunningUI(true);

    output.innerHTML = `
      <div class="plan-wrap">
        <div class="plan-title"><span class="spark">✦</span> Planning: <strong style="color:var(--text)">${escapeHtml(plan.title)}</strong></div>
        <div class="plan-progress"><i id="planBar"></i></div>
        <div class="plan-steps" id="planSteps"></div>
      </div>
    `;

    const stepsEl = document.getElementById("planSteps");
    const bar = document.getElementById("planBar");
    const stepNodes = [];

    for (let i = 0; i < plan.steps.length; i++) {
      if (token !== runToken) return;
      const s = plan.steps[i];
      const div = document.createElement("div");
      div.className = "plan-step";
      div.style.animationDelay = `${i * 0.08}s`;
      div.innerHTML = `
        <div class="n">${i + 1}</div>
        <div class="body"><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.detail)}</span></div>
        <div class="status-icon">✓</div>
      `;
      stepsEl.appendChild(div);
      stepNodes.push(div);
      await wait(120);
    }

    // Animate execution
    for (let i = 0; i < stepNodes.length; i++) {
      if (token !== runToken) return;
      stepNodes.forEach((n, idx) => {
        n.classList.toggle("active", idx === i);
      });
      status.textContent = `Step ${i + 1}/${stepNodes.length}`;
      if (bar) bar.style.width = `${((i + 0.35) / stepNodes.length) * 100}%`;
      await wait(700 + Math.random() * 350);
      if (token !== runToken) return;
      stepNodes[i].classList.remove("active");
      stepNodes[i].classList.add("done");
      if (bar) bar.style.width = `${((i + 1) / stepNodes.length) * 100}%`;
    }

    if (token !== runToken) return;

    status.textContent = "Ready to activate";
    status.classList.remove("running");
    status.classList.add("done");
    setRunningUI(false);

    const done = document.createElement("div");
    done.className = "plan-done-msg";
    done.innerHTML = `✓ Flow ready — 4 steps · estimated save ~25 min/day · <button type="button" class="btn btn-primary btn-sm" style="margin-left:0.5rem" id="activateBtn">Activate</button>`;
    output.querySelector(".plan-wrap")?.appendChild(done);

    document.getElementById("activateBtn")?.addEventListener("click", (e) => {
      const b = e.currentTarget;
      b.textContent = "Activated ✓";
      b.disabled = true;
      status.textContent = "Live";
      confettiBurst(b);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function confettiBurst(anchor) {
    const colors = ["#7c5cff", "#00d4aa", "#ffb020", "#60a5fa", "#ff5c7a"];
    const rect = anchor.getBoundingClientRect();
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("span");
      p.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: 6px; height: 6px; border-radius: 2px;
        background: ${colors[i % colors.length]};
        pointer-events: none; z-index: 9999;
      `;
      document.body.appendChild(p);
      const angle = (Math.PI * 2 * i) / 18;
      const dist = 40 + Math.random() * 60;
      p.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 30}px) scale(0)`,
            opacity: 0,
          },
        ],
        { duration: 700 + Math.random() * 300, easing: "cubic-bezier(0.22,1,0.36,1)" }
      ).onfinish = () => p.remove();
    }
  }

  runBtn?.addEventListener("click", () => {
    const text = input?.value?.trim() || chips[0]?.dataset.prompt || "Automate my daily tasks";
    if (input && !input.value.trim()) input.value = text;
    runAutomation(text);
  });

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runBtn?.click();
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      if (input) {
        input.value = chip.dataset.prompt || "";
        input.focus();
      }
      runAutomation(chip.dataset.prompt || "");
    });
  });

  // Subtle auto-demo on first load so the try section never looks empty long
  setTimeout(() => {
    if (output && output.querySelector(".output-empty")) {
      // leave empty state until user interacts — cleaner UX
    }
  }, 800);
})();
