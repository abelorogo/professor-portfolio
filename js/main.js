(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // ===== YEAR =====
    const y = new Date().getFullYear();
    const el = document.getElementById('year');
    if (el) el.textContent = y;

    // ===== NAV TOGGLE =====
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');
    const header = document.querySelector('.site-header');

    if (navToggle && nav) {
      navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.toggle('open');
      });
      document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && e.target !== navToggle) {
          nav.classList.remove('open');
        }
      });
    }

    if (header) {
      const toggleHeaderStyle = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', toggleHeaderStyle, { passive: true });
      toggleHeaderStyle();
    }

    // ===== SMOOTH SCROLL (for home page anchors) =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (nav) nav.classList.remove('open');
        }
      });
    });

    // ===== SECTION OBSERVER FOR HOME NAV =====
    const sectionLinks = document.querySelectorAll('.nav a[href^="#"]');
    const sectionIds = ['home', 'research', 'publications', 'teaching', 'contact'];
    const sectionElements = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (sectionLinks.length && sectionElements.length) {
      const updateActiveSection = () => {
        let currentSection = sectionElements[0].id;
        sectionElements.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 96 && rect.bottom > 96) {
            currentSection = section.id;
          }
        });

        sectionLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
      };

      window.addEventListener('scroll', updateActiveSection, { passive: true });
      updateActiveSection();
    }

    // ===== REVEAL ON SCROLL =====
    const revealElements = document.querySelectorAll('.fade-up, .reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealElements.forEach(el => observer.observe(el));

    // ===== 3D PHOTO TILT =====
    const card = document.getElementById('photo-card');
    const portrait = document.getElementById('portrait-3d');

    if (card && portrait) {
      card.addEventListener('mouseenter', () => {
        portrait.classList.remove('floating');
      });
      card.addEventListener('mouseleave', () => {
        portrait.classList.add('floating');
        portrait.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        const rotY = x * 18;
        const rotX = -y * 18;
        portrait.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        portrait.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });
    }

    // ===== CONTACT FORM =====
    const form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you — your message has been received! I will get back to you soon.');
        this.reset();
      });
    }

    // ===== PAGE TRANSITION EFFECT =====
    const mainElement = document.querySelector('main');
    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', function(e) {
        if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetUrl = this.getAttribute('href');
          if (mainElement) {
            mainElement.style.opacity = '0';
            mainElement.style.transition = 'opacity 0.4s ease';
          }
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 400);
        }
      });
    });

    if (mainElement) {
      mainElement.style.opacity = '0';
      setTimeout(() => {
        mainElement.style.transition = 'opacity 0.6s ease';
        mainElement.style.opacity = '1';
      }, 100);
    }

    // ===== THEME TOGGLE =====
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    // Set initial theme
    if (initialTheme === 'light') {
      document.body.classList.add('light-theme');
      updateThemeIcon('light');
      updateToggleLabel('light');
    } else {
      document.body.classList.remove('light-theme');
      updateThemeIcon('dark');
      updateToggleLabel('dark');
    }

    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.title = initialTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }
    if (themeToggle) {
      themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        // Save preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Update icon and label
        updateThemeIcon(isLight ? 'light' : 'dark');
        updateToggleLabel(isLight ? 'light' : 'dark');
        
        // Add a subtle animation feedback
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
        
        // Update tooltip
        this.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
      });
      
      // Add hover tooltip
      themeToggle.addEventListener('mouseenter', function() {
        const isLight = document.body.classList.contains('light-theme');
        this.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
      });
    }

    function updateThemeIcon(theme) {
      const icon = document.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'light' ? '☀️' : '🌙';
      }
    }
    
    function updateToggleLabel(theme) {
      const label = document.querySelector('.toggle-label');
      if (label) {
        label.textContent = theme === 'light' ? 'Light' : 'Dark';
      }
    }

    // ===== PUBLICATION FILTERS (if on publications page) =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication-item');
    const noResults = document.getElementById('no-results');

    if (filterBtns.length > 0 && publications.length > 0) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          // Remove active class from all buttons
          filterBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');

          const filter = this.dataset.filter;
          let visibleCount = 0;

          publications.forEach(pub => {
            const type = pub.dataset.type;
            const year = pub.dataset.year;

            if (filter === 'all') {
              pub.style.display = 'block';
              visibleCount++;
            } else if (filter === type || filter === year) {
              pub.style.display = 'block';
              visibleCount++;
            } else {
              pub.style.display = 'none';
            }
          });

          // Show/hide no results message
          if (noResults) {
            if (visibleCount === 0) {
              noResults.style.display = 'block';
            } else {
              noResults.style.display = 'none';
            }
          }
        });
      });
    }
  });
})();