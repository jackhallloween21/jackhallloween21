/* ==========================================================================
   Modern Developer Portfolio - JavaScript Logic & Interactive Canvas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvasBackground();
  initISTClock();
});

/* --- Theme Manager --- */
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  updateWidgetBoxTheme(savedTheme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      updateWidgetBoxTheme(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  const text = document.getElementById('themeText');
  if (icon && text) {
    if (theme === 'light') {
      icon.className = 'fas fa-sun';
      text.textContent = 'Light Mode';
    } else {
      icon.className = 'fas fa-moon';
      text.textContent = 'Dark Mode';
    }
  }
}

function updateWidgetBoxTheme(theme) {
  const widgetImg = document.getElementById('widgetBoxImg');
  if (widgetImg) {
    const themeParam = theme === 'light' ? 'light' : 'dark';
    widgetImg.src = `https://github-widgetbox.vercel.app/api/profile?username=jackhallloween21&data=followers,repositories,stars,commits&theme=${themeParam}`;
  }
}

/* --- Live Indian Standard Time (IST) Clock --- */
function initISTClock() {
  function updateISTClock() {
    const now = new Date();
    
    const timeFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const dateFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const timeString = timeFormatter.format(now).toUpperCase();
    const dateString = dateFormatter.format(now);

    const timeEl = document.getElementById('istTime');
    const dateEl = document.getElementById('istDate');

    if (timeEl) timeEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
  }

  updateISTClock();
  setInterval(updateISTClock, 1000);
}

/* --- Animated Canvas Background --- */
function initCanvasBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(theme) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'light' 
        ? `rgba(0, 136, 204, ${this.alpha * 0.7})` 
        : `rgba(0, 229, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const currentTheme = document.documentElement.getAttribute('data-theme');

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(currentTheme);

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 130) * (currentTheme === 'light' ? 0.12 : 0.18);
          ctx.strokeStyle = currentTheme === 'light' 
            ? `rgba(0, 136, 204, ${opacity})` 
            : `rgba(0, 229, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
