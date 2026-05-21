document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------
  // 1. Header Scrolled State
  // -------------------------------------------------------------
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load

  // -------------------------------------------------------------
  // 2. Mobile Menu Drawer Navigation
  // -------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const menuIcon = mobileToggle.querySelector('.icon-menu');
  const closeIcon = mobileToggle.querySelector('.icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-drawer .btn');

  const toggleMobileMenu = () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    if (isOpen) {
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    } else {
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  };

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close drawer when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    });
  });

  // -------------------------------------------------------------
  // 3. Dynamic Footer Copyright Year
  // -------------------------------------------------------------
  const footerYearTarget = document.getElementById('footer-year-target');
  if (footerYearTarget) {
    const currentYear = new Date().getFullYear();
    footerYearTarget.innerHTML = `&copy; ${currentYear} Sajid Khokhar. All rights reserved.`;
  }

  // -------------------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // -------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to observe anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // -------------------------------------------------------------
  // 5. Skill Bar Animations (Intersection Observer)
  // -------------------------------------------------------------
  const skillBars = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
        observer.unobserve(bar);
      }
    });
  }, {
    threshold: 0.2
  });

  skillBars.forEach(bar => {
    skillObserver.observe(bar);
  });

  // -------------------------------------------------------------
  // 6. Navigation Link Highlighting on Scroll
  // -------------------------------------------------------------
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let scrollPos = window.scrollY + 200; // Offset for header height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Initial highlight on load

  // -------------------------------------------------------------
  // 7. Motion Preference Check
  // -------------------------------------------------------------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // -------------------------------------------------------------
  // 8. Scroll Progress Indicator
  // -------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? doc.scrollTop / max : 0;
      progressBar.style.width = (ratio * 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // -------------------------------------------------------------
  // 9. Staggered Reveal for Card Groups
  // -------------------------------------------------------------
  const applyStagger = (selector, step) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
      el.style.transitionDelay = ((i % 6) * step) + 'ms';
      revealObserver.observe(el);
    });
  };
  applyStagger('.skill-card', 90);
  applyStagger('.timeline-item', 120);
  applyStagger('.contact-card', 80);

  // -------------------------------------------------------------
  // 10. Animated Stat Counters
  // -------------------------------------------------------------
  const animateCounter = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(\D*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1500;
    const startTime = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  if (!reduceMotion) {
    document.querySelectorAll('.highlight-num').forEach(el => {
      if (/^\d/.test(el.textContent.trim())) {
        counterObserver.observe(el);
      }
    });
  }

  // -------------------------------------------------------------
  // 11. Interactive 3D Card Tilt + Cursor-Tracking Glow
  // -------------------------------------------------------------
  if (!reduceMotion && canHover) {
    const tiltCards = document.querySelectorAll(
      '.project-card, .skill-card, .education-card, .skills-category-card'
    );
    const MAX_TILT = 6;

    tiltCards.forEach(card => {
      card.classList.add('tilt-card');
      const glow = document.createElement('span');
      glow.className = 'tilt-glow';
      card.appendChild(glow);

      let frame = null;

      card.addEventListener('mousemove', (e) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rotateX = (0.5 - py) * MAX_TILT * 2;
          const rotateY = (px - 0.5) * MAX_TILT * 2;
          card.style.transform =
            `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
          frame = null;
        });
      });

      card.addEventListener('mouseleave', () => {
        if (frame) {
          cancelAnimationFrame(frame);
          frame = null;
        }
        card.style.transform = '';
      });
    });
  }

  // -------------------------------------------------------------
  // 12. Cursor-Tracking Glow for Contact Cards
  // -------------------------------------------------------------
  if (canHover) {
    document.querySelectorAll('.contact-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
      });
    });
  }

});
