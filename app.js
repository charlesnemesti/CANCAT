(() => {
  'use strict';

  const config = window.CANCAT_CONFIG || {};
  const symbol = config.symbol || '$CANCAT';
  const contract = (config.contractAddress || '').trim();

  document.querySelectorAll('.js-symbol').forEach((node) => {
    node.textContent = symbol;
  });

  const setLink = (selector, url, fallback) => {
    document.querySelectorAll(selector).forEach((link) => {
      if (url) {
        link.href = url;
        link.classList.remove('is-disabled');
      } else {
        link.href = fallback;
        link.addEventListener('click', (event) => {
          if (fallback === '#launch') return;
          event.preventDefault();
        });
      }
    });
  };

  setLink('.js-buy-link', config.buyUrl, '#launch');
  setLink('.js-x-link', config.xUrl, '#top');

  const contractNode = document.querySelector('.js-contract');
  const copyButton = document.querySelector('.contract-copy');
  if (contractNode && contract) contractNode.textContent = contract;
  if (copyButton) copyButton.dataset.copy = contract;

  const toast = document.querySelector('.toast');
  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 1700);
  };

  copyButton?.addEventListener('click', async () => {
    if (!contract) {
      showToast('CONTRACT COMING AT LAUNCH');
      return;
    }
    try {
      await navigator.clipboard.writeText(contract);
      showToast('CONTRACT COPIED');
    } catch {
      showToast('COPY FAILED');
    }
  });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  menuButton?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open') || false;
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));

  const cursor = document.querySelector('.cursor-dot');
  if (cursor && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (event) => {
      cursor.style.opacity = '1';
      cursor.style.transform = `translate(${event.clientX - 9}px, ${event.clientY - 9}px)`;
    }, { passive: true });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  window.addEventListener('load', () => {
    window.setTimeout(() => document.getElementById('loader')?.classList.add('is-hidden'), 450);
  });

  const CAN_POP_KEY = 'cancat-opens';
  const CAN_POP_LINES = [
    '100% TUNA. 0% REGRET.',
    'BACK-SHELF ENERGY ACTIVATED.',
    'THE CAN HAS BEEN OPENED.',
    'FRESHNESS SEAL BROKEN. MEMES RELEASED.',
    'AISLE 7 HEARD THAT.',
    'PREMIUM CAT FOOD. PREMIUM VIBES.',
    'STILL WAVING. STILL CANNED.',
    'PULL-TAB LEGEND STATUS.',
    'FROM THE SHELF TO YOUR SOUL.',
    'THE CREW APPROVES THIS POP.',
  ];
  const CAN_POP_PARTICLES = ['🐟', '🥫', '✦', '$CAN', '🐾', 'TUNA', 'POP!'];

  const canPopFab = document.getElementById('can-pop-fab');
  const canPopCount = document.getElementById('can-pop-count');
  const canBurst = document.getElementById('can-burst');
  const heroCan = document.querySelector('.hero-art img');
  let openCount = Number(localStorage.getItem(CAN_POP_KEY) || 0);

  if (canPopCount) canPopCount.textContent = String(openCount);

  const playCanPop = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const hiss = ctx.createOscillator();
      const hissGain = ctx.createGain();
      hiss.type = 'sawtooth';
      hiss.frequency.setValueAtTime(180, now);
      hiss.frequency.exponentialRampToValueAtTime(60, now + 0.12);
      hissGain.gain.setValueAtTime(0.0001, now);
      hissGain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
      hissGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      hiss.connect(hissGain);
      hissGain.connect(ctx.destination);
      hiss.start(now);
      hiss.stop(now + 0.15);

      const pop = ctx.createOscillator();
      const popGain = ctx.createGain();
      pop.type = 'triangle';
      pop.frequency.setValueAtTime(520, now + 0.08);
      pop.frequency.exponentialRampToValueAtTime(120, now + 0.22);
      popGain.gain.setValueAtTime(0.0001, now + 0.08);
      popGain.gain.exponentialRampToValueAtTime(0.12, now + 0.1);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      pop.connect(popGain);
      popGain.connect(ctx.destination);
      pop.start(now + 0.08);
      pop.stop(now + 0.25);
      window.setTimeout(() => ctx.close(), 400);
    } catch {
      /* audio optional */
    }
  };

  const spawnParticles = (x, y, bonus = false) => {
    if (!canBurst) return;
    const total = bonus ? 28 : 16;
    for (let i = 0; i < total; i += 1) {
      const el = document.createElement('span');
      const angle = (Math.PI * 2 * i) / total + Math.random() * 0.4;
      const dist = 80 + Math.random() * (bonus ? 220 : 140);
      const tx = `${Math.cos(angle) * dist}px`;
      const ty = `${Math.sin(angle) * dist - 40}px`;
      const rot = `${Math.floor(Math.random() * 720 - 360)}deg`;
      const label = CAN_POP_PARTICLES[Math.floor(Math.random() * CAN_POP_PARTICLES.length)];
      el.className = `can-particle${Math.random() > 0.5 ? ' is-lime' : ' is-pink'}`;
      el.textContent = label;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty('--tx', tx);
      el.style.setProperty('--ty', ty);
      el.style.setProperty('--rot', rot);
      el.style.setProperty('--dur', `${700 + Math.random() * 500}ms`);
      canBurst.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }
  };

  canPopFab?.addEventListener('click', () => {
    openCount += 1;
    localStorage.setItem(CAN_POP_KEY, String(openCount));
    if (canPopCount) canPopCount.textContent = String(openCount);

    const rect = canPopFab.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const isJackpot = openCount % 10 === 0;
    const line = isJackpot
      ? `JACKPOT! ${openCount} CANS OPENED.`
      : CAN_POP_LINES[Math.floor(Math.random() * CAN_POP_LINES.length)];

    canPopFab.classList.add('is-popping');
    document.body.classList.add('is-can-shaking');
    heroCan?.classList.add('is-can-waving');
    playCanPop();
    spawnParticles(x, y, isJackpot);
    showToast(line);

    window.setTimeout(() => canPopFab.classList.remove('is-popping'), 450);
    window.setTimeout(() => document.body.classList.remove('is-can-shaking'), 420);
    window.setTimeout(() => heroCan?.classList.remove('is-can-waving'), 550);
  });

  if (heroCan && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 4;
      heroCan.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }
})();
