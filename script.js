// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navEl = document.querySelector("nav");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navEl && navLinks) {
  navToggle.addEventListener("click", () => {
    navEl.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navEl.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

// Highlight active nav link based on current page
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const linkPage = link.getAttribute("href");
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});

// Scroll reveal animation
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

// Adaptive text color: elements with a [data-bg="#hex"] hint automatically
// get black or white text (and a matching muted variant), based on the
// background color's brightness, so new panels never need manual color rules.
document.querySelectorAll("[data-bg]").forEach((el) => {
  const hex = el.getAttribute("data-bg").replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness >= 128) {
    el.style.setProperty("--panel-text", "#1a1a1a");
    el.style.setProperty("--panel-text-muted", "rgba(0, 0, 0, 0.5)");
  } else {
    el.style.setProperty("--panel-text", "#ffffff");
    el.style.setProperty("--panel-text-muted", "rgba(255, 255, 255, 0.6)");
  }
});

// Pinned case-study scroll sequence: each block's hero image appears first,
// then its details slide in, then the next block's hero crossfades in — all
// driven by a lagged/smoothed scroll progress value for a slow, blended feel.
const caseListPinWrap = document.querySelector(".case-list-pin-wrap");
const caseListPinned = document.querySelector(".case-list");

if (caseListPinWrap && caseListPinned) {
  const blocks = Array.from(caseListPinned.querySelectorAll(".case-block"));
  const n = blocks.length;

  // Reveal all blocks now that JS is driving per-child visibility, so there's
  // no flash of un-styled stacked content before the first frame renders.
  blocks.forEach((block) => {
    block.style.opacity = "1";
  });

  const DETAIL_DURATION = 0.09;
  const HERO_TRANSITION_DURATION = 0.08;
  const GAP_AFTER_HERO_IN = 0.06;
  const GAP_AFTER_DETAIL = 0.1;
  const TAIL_ROOM = 0.14;

  function buildStages() {
    const raw = [];
    let cursor = 0;

    for (let i = 0; i < n; i++) {
      let heroIn = null;
      if (i > 0) {
        heroIn = [cursor, cursor + HERO_TRANSITION_DURATION];
        cursor += HERO_TRANSITION_DURATION;
      }

      const detailStart = cursor + GAP_AFTER_HERO_IN;
      const detailEnd = detailStart + DETAIL_DURATION;

      let heroOut = null;
      if (i < n - 1) {
        const heroOutStart = detailEnd + GAP_AFTER_DETAIL;
        heroOut = [heroOutStart, heroOutStart + HERO_TRANSITION_DURATION];
        cursor = heroOutStart;
      } else {
        cursor = detailEnd;
      }

      raw.push({ heroIn, detailIn: [detailStart, detailEnd], heroOut });
    }

    const maxT = Math.max(cursor + TAIL_ROOM, 1);
    return raw.map((s) => ({
      heroIn: s.heroIn ? s.heroIn.map((v) => v / maxT) : null,
      detailIn: s.detailIn.map((v) => v / maxT),
      heroOut: s.heroOut ? s.heroOut.map((v) => v / maxT) : null,
    }));
  }

  const stages = buildStages();
  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  // Smootherstep easing for a gentle, blended in/out curve rather than linear.
  function ease(a, b, t) {
    if (a === b) return t < a ? 0 : 1;
    const x = clamp01((t - a) / (b - a));
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  function applyStage(block, stage, p) {
    const media = block.querySelector(".case-panel-media");
    const content = block.querySelector(".case-panel-content");

    let heroOpacity = stage.heroIn ? 0 : 1;
    let heroY = stage.heroIn ? 40 : 0;

    if (stage.heroIn) {
      const t = ease(stage.heroIn[0], stage.heroIn[1], p);
      heroOpacity = t;
      heroY = 40 * (1 - t);
    }

    if (stage.heroOut) {
      const t = ease(stage.heroOut[0], stage.heroOut[1], p);
      heroOpacity = Math.min(heroOpacity, 1 - t);
      if (p >= stage.heroOut[0]) {
        heroY = -40 * t;
      }
    }

    media.style.opacity = heroOpacity;
    media.style.transform = `translateY(${heroY}px)`;

    let detailOpacity = 0;
    let detailY = 24;
    const dt = ease(stage.detailIn[0], stage.detailIn[1], p);
    detailOpacity = dt;
    detailY = 24 * (1 - dt);

    if (stage.heroOut) {
      const t = ease(stage.heroOut[0], stage.heroOut[1], p);
      detailOpacity = Math.min(detailOpacity, 1 - t);
      if (p >= stage.heroOut[0]) {
        detailY = -24 * t;
      }
    }

    content.style.opacity = detailOpacity;
    content.style.transform = `translateY(${detailY}px)`;

    block.classList.toggle("is-active", heroOpacity > 0.05 || detailOpacity > 0.05);
  }

  function setWrapHeight() {
    const vh = window.innerHeight;
    caseListPinWrap.style.height = vh + vh * 5 + "px";
  }

  function computeRawProgress() {
    const rect = caseListPinWrap.getBoundingClientRect();
    const total = caseListPinWrap.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return clamp01(-rect.top / total);
  }

  let smoothProgress = 0;
  const LERP = 0.075;

  function render() {
    const rawProgress = computeRawProgress();
    smoothProgress += (rawProgress - smoothProgress) * LERP;
    if (Math.abs(rawProgress - smoothProgress) < 0.0004) {
      smoothProgress = rawProgress;
    }

    blocks.forEach((block, i) => applyStage(block, stages[i], smoothProgress));

    requestAnimationFrame(render);
  }

  setWrapHeight();
  window.addEventListener("resize", setWrapHeight);
  requestAnimationFrame(render);
}
