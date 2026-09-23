// ================= LOADER =================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

// ================= PARTICLES =================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let hearts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 182, 228, ${this.opacity})`;
    ctx.fill();
  }
}

class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = Math.random() * 10 + 8;
    this.speed = Math.random() * 0.8 + 0.3;
    this.opacity = Math.random() * 0.25 + 0.1;
    this.wobble = Math.random() * Math.PI * 2;
  }
  update() {
    this.y -= this.speed;
    this.x += Math.sin(this.wobble) * 0.4;
    this.wobble += 0.02;
    if (this.y < -30) {
      this.y = canvas.height + 20;
      this.x = Math.random() * canvas.width;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.size / 16, this.size / 16);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-6, -6, -12, 2, 0, 10);
    ctx.bezierCurveTo(12, 2, 6, -6, 0, 0);
    ctx.fillStyle = `rgba(255, 77, 109, ${this.opacity})`;
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  hearts = [];
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  for (let i = 0; i < 8; i++) hearts.push(new Heart());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  hearts.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ================= MUSIC =================
const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    musicIcon.textContent = '🎵';
  } else {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
});

// ================= NAVIGATION =================
document.getElementById('open-surprise').addEventListener('click', () => {
  transitionTo('intro');
});

document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('data-next');
    transitionTo(next);
  });
});

function transitionTo(id) {
  const current = document.querySelector('.section:not(.hidden)');
  if (current) {
    current.style.opacity = '0';
    current.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      current.classList.add('hidden');
      current.style.opacity = '1';
      showSection(id);
    }, 600);
  } else {
    showSection(id);
  }
}

function showSection(id) {
  const section = document.getElementById(id);
  section.classList.remove('hidden');
  section.style.opacity = '0';
  setTimeout(() => {
    section.style.transition = 'opacity 0.8s ease';
    section.style.opacity = '1';
  }, 50);

  // Special triggers
  if (id === 'things') startReveal();
  if (id === 'secret') startTypewriter();
  if (id === 'final') startFinalSequence();
}

// ================= REVEAL LIST =================
function startReveal() {
  const items = document.querySelectorAll('.reveal-item');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, i * 900);
  });
}

// ================= TYPEWRITER =================
const typewriterLines = [
  "I don't know when it happened…",
  "But somewhere between all the random conversations…",
  "all your advice…",
  "all the teasing…",
  "all the stupid jokes…",
  "You became someone who means a little more to me than you probably realize. ❤️"
];

function startTypewriter() {
  const el = document.getElementById('typewriter');
  el.innerHTML = '';
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= typewriterLines.length) {
      document.querySelector('.tiny-heart').classList.add('show');
      return;
    }
    const line = typewriterLines[lineIndex];
    let charIndex = 0;
    const p = document.createElement('p');
    p.style.marginBottom = '14px';
    el.appendChild(p);

    function typeChar() {
      if (charIndex < line.length) {
        p.textContent += line[charIndex];
        charIndex++;
        setTimeout(typeChar, 38);
      } else {
        lineIndex++;
        setTimeout(typeLine, 700);
      }
    }
    typeChar();
  }
  typeLine();
}

// ================= FINAL SEQUENCE =================
function startFinalSequence() {
  const light = document.getElementById('final-light');
  const heart = document.getElementById('final-heart');
  const textEl = document.getElementById('final-text');
  const signature = document.querySelector('.signature');

  setTimeout(() => light.classList.add('show'), 400);
  setTimeout(() => heart.classList.add('show'), 1600);

  const finalLines = [
    "You know what's funny?",
    "You started as someone I could talk to…",
    "became someone I could trust…",
    "became someone I could always count on…",
    "And somehow… you became one of my favourite people. ❤️",
    "Happy Birthday, Dhilli Ganesh 🎂💜"
  ];

  let idx = 0;
  textEl.innerHTML = '';

  function showNextLine() {
    if (idx >= finalLines.length) {
      signature.classList.add('show');
      launchConfetti();
      return;
    }
    const p = document.createElement('p');
    p.textContent = finalLines[idx];
    p.style.opacity = '0';
    p.style.transition = 'opacity 1s ease';
    p.style.marginBottom = '12px';
    textEl.appendChild(p);
    setTimeout(() => p.style.opacity = '1', 50);
    idx++;
    setTimeout(showNextLine, idx === 5 ? 1800 : 1400);
  }

  setTimeout(showNextLine, 2800);
}

// ================= CONFETTI =================
function launchConfetti() {
  const confettiCanvas = document.getElementById('confetti-canvas');
  const cctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#6b3fa0', '#9b59b6', '#ff4d6d', '#c9b6e4', '#ffffff'];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      rotSpeed: Math.random() * 6 - 3
    });
  }

  function drawConfetti() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let active = false;
    pieces.forEach(p => {
      p.y += p.speed;
      p.rot += p.rotSpeed;
      if (p.y < confettiCanvas.height + 20) active = true;
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot * Math.PI / 180);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      cctx.restore();
    });
    if (active) requestAnimationFrame(drawConfetti);
  }
  drawConfetti();
}

// ================= EASTER EGG =================
document.getElementById('easter-egg').addEventListener('click', () => {
  document.getElementById('easter-modal').classList.remove('hidden');
});

document.getElementById('close-easter').addEventListener('click', () => {
  document.getElementById('easter-modal').classList.add('hidden');
});
