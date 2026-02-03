// Simple personalization + "dodging" No button + Yes celebration.
// Replace images in /images/ and update text in index.html as needed.

// Helpers
const q = s => document.querySelector(s);
const qa = s => Array.from(document.querySelectorAll(s));

const noBtn = q("#noBtn");
const yesBtn = q("#yesBtn");
const controls = q("#controls");
const overlay = q("#overlay");
const closeOverlay = q("#closeOverlay");
const mainPhoto = q("#mainPhoto");

// Make the "No" button dodge the cursor by randomly repositioning inside controls.
function moveNoButtonAway() {
  const container = controls;
  const btn = noBtn;
  const pad = 12; // padding inside container
  const containerRect = container.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  // Compute available area
  const maxLeft = Math.max(containerRect.width - btnRect.width - pad, pad);
  const maxTop = Math.max(containerRect.height - btnRect.height - pad, pad);

  // Choose a new position (random but biased away from cursor)
  const newLeft = Math.floor(Math.random() * maxLeft) + pad;
  const newTop = Math.floor(Math.random() * maxTop) + pad;

  // Apply transform relative to container
  btn.style.position = "absolute";
  btn.style.left = newLeft + "px";
  btn.style.top = newTop + "px";
}

// Reset button to original flow (center) — used after a successful "Yes" or if window resizes
function resetNoButton() {
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
}

// On desktop, dodge when the pointer gets near the button
noBtn.addEventListener("mouseenter", (e) => {
  moveNoButtonAway();
});

// Also dodge on click/touch so it is hard to tap on mobile
noBtn.addEventListener("click", (e) => {
  // prevent accidental click
  e.preventDefault();
  moveNoButtonAway();
});

// If the window is resized, reset so layout stays sane
window.addEventListener("resize", resetNoButton);

// Yes button: show overlay + simple confetti
yesBtn.addEventListener("click", () => {
  showOverlay();
  burstConfetti(36);
});

closeOverlay?.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// Overlay show
function showOverlay() {
  overlay.classList.remove("hidden");
}

// Simple confetti generator: create small colored divs that fall briefly
function burstConfetti(count = 24) {
  const colors = ["#ff5c8a","#ffd166","#7ae7c7","#9ad0ff","#d3a4ff"];
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "0";
  container.style.top = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.overflow = "visible";
  document.body.appendChild(container);

  for (let i=0;i<count;i++){
    const el = document.createElement("div");
    const size = Math.random()*10 + 6;
    el.style.width = `${size}px`;
    el.style.height = `${size*0.6}px`;
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.position = "absolute";
    el.style.left = `${50 + (Math.random()*60-30)}%`;
    el.style.top = `${10 + Math.random()*10}%`;
    el.style.borderRadius = "2px";
    el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
    el.style.opacity = "1";
    el.style.transition = `transform 1200ms cubic-bezier(.2,.8,.2,1), opacity 1200ms ease`;
    container.appendChild(el);

    // Animate fall + drift
    requestAnimationFrame(() => {
      const tx = (Math.random()*160-80);
      const ty = 800 + Math.random()*200;
      const rot = Math.random()*720 - 360;
      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
      el.style.opacity = "0";
    });

    // remove after animation
    setTimeout(()=> {
      el.remove();
    }, 1400);
  }

  // remove container when done
  setTimeout(()=> container.remove(), 1600);
}

// Gallery thumbnails: clicking swaps main photo
qa(".thumb").forEach(t => {
  t.addEventListener("click", () => {
    const src = t.getAttribute("data-src");
    if (src) mainPhoto.src = src;
    // optional: highlight selected thumb
    qa(".thumb").forEach(x => x.style.outline = "none");
    t.style.outline = "3px solid rgba(255,92,138,0.16)";
  });
});

// Optional: prevent touch from easily tapping "No" on mobile by moving it when controls are touched
controls.addEventListener("touchstart", (e) => {
  // If the touch target was the No button, move it away
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (target === noBtn || noBtn.contains(target)) {
    moveNoButtonAway();
  }
});