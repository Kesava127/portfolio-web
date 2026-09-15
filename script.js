// Scroll reveals
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Lightweight live engineering-style background: drifting points + drafting lines.
const canvas = document.getElementById('live-bg');
const ctx = canvas.getContext('2d');
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
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

  if (!points.length) {
    const count = Math.max(18, Math.min(42, Math.round(width / 34)));
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.2 + 0.4
      });
    }
  }
}

function render(time = 0) {
  ctx.clearRect(0, 0, width, height);
  const driftX = (mouse.x - 0.5) * 8;
  const driftY = (mouse.y - 0.5) * 8;

  // Fine drafting grid
  ctx.strokeStyle = 'rgba(82,76,68,0.045)';
  ctx.lineWidth = 1;
  const spacing = width < 600 ? 72 : 92;
  const offsetX = ((time * 0.003) % spacing);
  for (let x = -spacing + offsetX; x < width + spacing; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x + driftX, 0); ctx.lineTo(x + driftX, height); ctx.stroke();
  }
  for (let y = -spacing + offsetX; y < height + spacing; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y + driftY); ctx.lineTo(width, y + driftY); ctx.stroke();
  }

  if (!isReducedMotion) {
    points.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(72,68,61,0.14)';
      ctx.arc(p.x + driftX * 0.3, p.y + driftY * 0.3, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(72,68,61,${0.055 * (1 - dist / 150)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
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
