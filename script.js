const root = document.documentElement;
const cursor = document.querySelector(".egg-cursor");

function updateScroll() {
  const max = document.body.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty("--scroll", progress.toFixed(4));
}

window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("resize", updateScroll);
updateScroll();

if (cursor) {
  const target = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
  const current = { ...target };
  let previousX = target.x;
  let previousY = target.y;
  let hasPointer = false;

  function setTarget(x, y) {
    target.x = x;
    target.y = y;
    hasPointer = true;
    cursor.classList.add("is-visible");
  }

  window.addEventListener("pointermove", (event) => {
    setTarget(event.clientX, event.clientY);
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    cursor.classList.remove("is-visible");
    hasPointer = false;
  });

  window.addEventListener("pointerenter", (event) => {
    setTarget(event.clientX, event.clientY);
  });

  window.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    setTarget(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchend", () => {
    cursor.classList.remove("is-visible");
    hasPointer = false;
  });

  function animateCursor() {
    current.x += (target.x - current.x) * 0.18;
    current.y += (target.y - current.y) * 0.18;

    const velocityX = current.x - previousX;
    const velocityY = current.y - previousY;
    const speed = Math.min(Math.hypot(velocityX, velocityY), 42);
    const rotate = Math.max(Math.min(velocityX * 0.75, 18), -18);
    const scale = 1 + speed * 0.0032;

    cursor.style.setProperty("--cursor-x", `${current.x.toFixed(2)}px`);
    cursor.style.setProperty("--cursor-y", `${current.y.toFixed(2)}px`);
    cursor.style.setProperty("--cursor-rotate", `${rotate.toFixed(2)}deg`);
    cursor.style.setProperty("--cursor-scale", scale.toFixed(3));

    previousX = current.x;
    previousY = current.y;

    if (!hasPointer) {
      current.x = target.x;
      current.y = target.y;
    }

    requestAnimationFrame(animateCursor);
  }

  requestAnimationFrame(animateCursor);
}
