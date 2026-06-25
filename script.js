/**
 * Harshit Bishnoi - Pixel Portfolio
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // THEME TOGGLE (DARK / LIGHT MODE)
  // ==========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Pixel Icons XML
  const sunSVG = `
    <svg class="sun-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
      <rect x="10" y="2" width="4" height="2" fill="currentColor"/>
      <rect x="10" y="20" width="4" height="2" fill="currentColor"/>
      <rect x="2" y="10" width="2" height="4" fill="currentColor"/>
      <rect x="20" y="10" width="2" height="4" fill="currentColor"/>
      <rect x="5" y="5" width="2" height="2" fill="currentColor"/>
      <rect x="17" y="17" width="2" height="2" fill="currentColor"/>
      <rect x="17" y="5" width="2" height="2" fill="currentColor"/>
      <rect x="5" y="17" width="2" height="2" fill="currentColor"/>
      <rect x="8" y="8" width="8" height="8" fill="currentColor"/>
    </svg>
  `;

  const moonSVG = `
    <svg class="moon-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
      <rect x="12" y="4" width="6" height="2" fill="currentColor"/>
      <rect x="10" y="6" width="10" height="2" fill="currentColor"/>
      <rect x="8" y="8" width="6" height="2" fill="currentColor"/>
      <rect x="8" y="10" width="6" height="2" fill="currentColor"/>
      <rect x="8" y="12" width="6" height="2" fill="currentColor"/>
      <rect x="10" y="14" width="8" height="2" fill="currentColor"/>
      <rect x="12" y="16" width="6" height="2" fill="currentColor"/>
    </svg>
  `;

  // Init theme from localStorage
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    body.classList.add('light-theme');
    themeToggle.innerHTML = moonSVG;
  } else {
    body.classList.remove('light-theme');
    themeToggle.innerHTML = sunSVG;
  }

  // Toggle Action
  themeToggle.addEventListener('click', () => {
    playBeep('select');
    if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = sunSVG;
    } else {
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = moonSVG;
    }
  });

  // ==========================================================================
  // RETRO 8-BIT AUDIO SYNTHESIZER
  // ==========================================================================
  function playBeep(type = 'select') {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'select') {
        // High chip sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'click') {
        // Flat quick beep
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (error) {
      // Browser autoplay policy might restrict audio context creation
    }
  }

  // ==========================================================================
  // NAVIGATION INTERACTIVE EFFECTS & SCROLL OBSERVING
  // ==========================================================================
  const navLinks = document.querySelectorAll('.nav-links a, .logo');
  const sections = document.querySelectorAll('section');

  // Trigger beep on link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      playBeep('click');
      
      // Since Experience and Contact sections are removed to match the image,
      // clicking them scrolls smoothly to the footer and gives a pixel toast notice.
      const href = link.getAttribute('href');
      if (href === '#experience' || href === '#contact') {
        e.preventDefault();
        document.querySelector('.pixel-footer').scrollIntoView({ behavior: 'smooth' });
        showPixelToast(`${href.substring(1).toUpperCase()} section is minimized in replica mode.`);
      }
    });
  });

  // Also beep on standard button clicks
  const buttons = document.querySelectorAll('.btn, .project-link, .view-all-link');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep('select');
    });
  });

  // Intersection Observer for Active State Highlight
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger near screen focus center
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // ==========================================================================
  // MICRO INTERACTION: TERMINAL TYPING OR CURSOR PULSE
  // ==========================================================================
  const statusCard = document.querySelector('.status-card');
  if (statusCard) {
    statusCard.addEventListener('click', () => {
      playBeep('click');
      statusCard.style.borderColor = 'var(--color-green)';
      setTimeout(() => {
        statusCard.style.borderColor = 'var(--border-color)';
      }, 150);
    });
  }

  // ==========================================================================
  // HELPER: PIXEL TOAST NOTIFICATION
  // ==========================================================================
  function showPixelToast(message) {
    // Remove existing toast if any
    const existing = document.querySelector('.pixel-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'pixel-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'var(--bg-card)';
    toast.style.border = '2px solid var(--border-color)';
    toast.style.boxShadow = 'var(--pixel-shadow)';
    toast.style.color = 'var(--text-main)';
    toast.style.fontFamily = 'var(--font-primary)';
    toast.style.fontSize = '0.85rem';
    toast.style.padding = '10px 16px';
    toast.style.borderRadius = 'var(--border-radius)';
    toast.style.zIndex = '999';
    toast.style.pointerEvents = 'none';
    toast.innerHTML = `<span class="prompt-char">&gt;</span> ${message}`;
    
    document.body.appendChild(toast);
    
    // Animate out and remove
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

});
