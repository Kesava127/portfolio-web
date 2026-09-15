// Scroll reveals
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Lightweight live engineering-style background: subtle moving drafting field.
const canvas = document.getElementById('live-bg');
const ctx = canvas.getContext('2d');
let width = 0;
let height = 0;
let dpr = 1;
const points = [];
const mouse = { x: 0.5, y: 0.5 };
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  points.length = 0;
  const count = width < 600 ? 9 : Math.min(15, Math.max(10, Math.round(width / 100)));
  for (let i = 0; i < count; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      r: 0.7 + Math.random() * 0.5
    });
  }
}

function render(time = 0) {
  ctx.clearRect(0, 0, width, height);
  const parallaxX = (mouse.x - 0.5) * 4;
  const parallaxY = (mouse.y - 0.5) * 4;

  // Very faint drafting grid — intentionally quiet behind the content.
  ctx.strokeStyle = 'rgba(82, 103, 92, 0.032)';
  ctx.lineWidth = 1;
  const spacing = width < 600 ? 110 : 140;
  const drift = isReducedMotion ? 0 : (time * 0.0015) % spacing;
  for (let x = -spacing + drift; x < width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + parallaxX, 0);
    ctx.lineTo(x + parallaxX, height);
    ctx.stroke();
  }
  for (let y = -spacing + drift; y < height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + parallaxY);
    ctx.lineTo(width, y + parallaxY);
    ctx.stroke();
  }

  if (!isReducedMotion) {
    points.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const px = p.x + parallaxX * 0.35;
      const py = p.y + parallaxY * 0.35;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(72, 95, 83, 0.13)';
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 175) {
          ctx.strokeStyle = `rgba(72, 95, 83, ${0.035 * (1 - dist / 175)})`;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(q.x + parallaxX * 0.35, q.y + parallaxY * 0.35);
          ctx.stroke();
        }
      }
    });
  }

  requestAnimationFrame(render);
}

window.addEventListener('resize', resize);
window.addEventListener('pointermove', (event) => {
  mouse.x = event.clientX / window.innerWidth;
  mouse.y = event.clientY / window.innerHeight;
});
resize();
requestAnimationFrame(render);
