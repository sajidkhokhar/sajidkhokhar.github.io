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

});
