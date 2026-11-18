(() => {
  "use strict";

  const box = document.querySelector(".reel-stats");
  if (!box) return;

  const items = [...box.querySelectorAll(".rs-item")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((item, i) => item.style.setProperty("--i", i));

  const nums = items.map((item) => {
    const el = item.querySelector(".rs-num");
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    return { el, target: m ? Number(m[1]) : 0, suffix: m ? m[2] : "", text: el.textContent };
  });

  if (reduce) return;

  nums.forEach((n) => { n.el.textContent = "0" + n.suffix; });
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function count(n, delay) {
    const dur = 3200;
    setTimeout(() => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        n.el.textContent = Math.round(n.target * ease(p)) + n.suffix;
        if (p < 1) requestAnimationFrame(step);
        else n.el.textContent = n.text;
      };
      requestAnimationFrame(step);
    }, delay);
  }

  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    box.classList.add("is-in");
    nums.forEach((n, i) => count(n, i * 450));
  }, { threshold: 0.35 }).observe(box);
})();