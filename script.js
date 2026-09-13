const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const ticker = document.querySelector('.ticker-inner');
let x = 0;
function animateTicker(){
  x -= 0.25;
  if (Math.abs(x) > ticker.scrollWidth / 2) x = 0;
  ticker.style.transform = `translateX(${x}px)`;
  requestAnimationFrame(animateTicker);
}
animateTicker();
