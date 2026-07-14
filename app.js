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
  setLink('.js-tg-link', config.telegramUrl, '#top');

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
})();
