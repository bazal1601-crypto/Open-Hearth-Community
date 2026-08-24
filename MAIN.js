/* ============================================
   PERSON 1 — Shell Team JS
   Navbar toggle, scroll effects, newsletter demo
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile menu toggle ---------- */
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked (mobile)
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Navbar shrink/shadow on scroll ---------- */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ---------- Newsletter form (footer) — no backend, fake success ---------- */
  const newsletterForm = document.querySelector('.footer__newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const msg = document.querySelector('.footer__newsletter-msg');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!input.value || !emailPattern.test(input.value)) {
        msg.textContent = 'Please enter a valid email address.';
        msg.style.color = 'var(--color-error)';
        return;
      }

      msg.textContent = `Thanks! We'll send updates to ${input.value}.`;
      msg.style.color = 'var(--color-accent)';
      input.value = '';
    });
  }
    /* ---------- Hero image slider (crossfade) ---------- */
  const slides = document.querySelectorAll('.hero__slide');

  if (slides.length > 1) {
    let currentSlide = 0;

    setInterval(() => {
      slides[currentSlide].classList.remove('is-active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('is-active');
    }, 3500); // change slide every 3.5 seconds
  }
  /* ---------- About stat counters ---------- */
  const counters = document.querySelectorAll('.about__stat-number');

  if (counters.length) {
    const startCounters = () => {
      counters.forEach((counter) => {
        const target = Number(counter.dataset.target);
        if (!target) return;
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = `${Math.floor(target * eased)}+`;
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = `${target}+`;
          }
        }
        requestAnimationFrame(updateCounter);
      });
    };

    const statsBlock = document.querySelector('.about__stats');
    if (statsBlock) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      counterObserver.observe(statsBlock);
    }
  }
    /* ---------- Services filter ---------- */
  const serviceFilters = document.querySelectorAll('.services__filter');
  const serviceCards = document.querySelectorAll('.services__card');

  serviceFilters.forEach((filterButton) => {
    filterButton.addEventListener('click', () => {
      const selectedCategory = filterButton.dataset.filter;

      serviceFilters.forEach((btn) => btn.classList.remove('services__filter--active'));
      filterButton.classList.add('services__filter--active');

      serviceCards.forEach((card) => {
        const match = selectedCategory === 'all' || card.dataset.category === selectedCategory;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Services "Read more" toggle ---------- */
  document.querySelectorAll('.services__read-more').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.services__card');
      card.classList.toggle('is-open');
      button.textContent = card.classList.contains('is-open') ? 'Read Less ↑' : 'Read More →';
    });
  });
    /* ---------- Contact form validation + submit ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const messageInput = document.getElementById('contactMessage');
      const formMsg = document.getElementById('contactFormMsg');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let isValid = true;

      document.getElementById('contactNameField').classList.toggle('field--error', !nameInput.value.trim());
      if (!nameInput.value.trim()) isValid = false;

      const emailValid = emailPattern.test(emailInput.value.trim());
      document.getElementById('contactEmailField').classList.toggle('field--error', !emailValid);
      if (!emailValid) isValid = false;

      document.getElementById('contactMessageField').classList.toggle('field--error', !messageInput.value.trim());
      if (!messageInput.value.trim()) isValid = false;

      if (!isValid) {
        formMsg.textContent = 'Please fix the errors above.';
        formMsg.style.color = 'var(--color-error)';
        return;
      }

      // No backend — save locally so submissions aren't lost on refresh, and confirm to the user
      const submission = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: document.getElementById('contactPhone').value.trim(),
        address: document.getElementById('contactAddress').value.trim(),
        message: messageInput.value.trim(),
        submittedAt: new Date().toLocaleString()
      };

      const existing = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
      existing.push(submission);
      localStorage.setItem('contactSubmissions', JSON.stringify(existing));

      formMsg.textContent = `Thanks, ${submission.name}! Your message has been received.`;
      formMsg.style.color = 'var(--color-success)';
      contactForm.reset();
    });
  }
    /* ---------- Testimonials carousel (Person 3) ---------- */
  const testimonialSlides = Array.from(document.querySelectorAll('.testimonials__slide'));
  const dots = Array.from(document.querySelectorAll('.testimonials__dot'));
  const prevBtn = document.querySelector('.testimonials__arrow--prev');
  const nextBtn = document.querySelector('.testimonials__arrow--next');

  if (testimonialSlides.length > 0) {
    let currentIndex = 0;
    let autoplayTimer = null;

    function updateCarousel(index) {
      testimonialSlides.forEach((slide, idx) => {
        slide.classList.toggle('testimonials__slide--active', idx === index);
      });
      dots.forEach((dot, idx) => {
        const isSelected = idx === index;
        dot.classList.toggle('testimonials__dot--active', isSelected);
        dot.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
      currentIndex = index;
    }

    function nextSlide() {
      updateCarousel((currentIndex + 1) % testimonialSlides.length);
    }

    function prevSlide() {
      updateCarousel((currentIndex - 1 + testimonialSlides.length) % testimonialSlides.length);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => { updateCarousel(idx); startAutoplay(); });
    });

    const carouselContainer = document.querySelector('.testimonials__carousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoplay);
      carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  /* ---------- Events category filter (Person 3) ---------- */
  const filterBtns = document.querySelectorAll('.events__filter-btn');
  const eventCards = document.querySelectorAll('.events__card');

  if (filterBtns.length > 0 && eventCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedFilter = btn.getAttribute('data-filter');

        filterBtns.forEach((b) => {
          b.classList.remove('events__filter-btn--active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('events__filter-btn--active');
        btn.setAttribute('aria-selected', 'true');

        eventCards.forEach((card) => {
          const match = selectedFilter === 'all' || card.getAttribute('data-category') === selectedFilter;
          card.classList.toggle('events__card--hidden', !match);
        });
      });
    });
  }

  /* ---------- Order/booking form validation (Person 3) ---------- */
  const supportForm = document.getElementById('support-request-form');
  const successContainer = document.getElementById('order-form-success');
  const resetBtn = document.getElementById('order-form-reset');

  if (supportForm) {
    const fields = {
      name: { input: document.getElementById('order-name'), validate: (v) => v.trim().length > 0 },
      email: { input: document.getElementById('order-email'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      service: { input: document.getElementById('order-service'), validate: (v) => v.trim() !== '' },
      message: { input: document.getElementById('order-message'), validate: (v) => v.trim().length > 0 }
    };

    function validateField(fieldKey) {
      const field = fields[fieldKey];
      if (!field || !field.input) return true;
      const isValid = field.validate(field.input.value);
      const parentField = field.input.closest('.field');
      if (parentField) parentField.classList.toggle('field--error', !isValid);
      return isValid;
    }

    Object.keys(fields).forEach((key) => {
      const inputEl = fields[key].input;
      if (inputEl) {
        inputEl.addEventListener('input', () => validateField(key));
        inputEl.addEventListener('blur', () => validateField(key));
      }
    });

    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      Object.keys(fields).forEach((key) => {
        if (!validateField(key)) isFormValid = false;
      });

      if (isFormValid) {
        const submissionData = {
          name: fields.name.input.value.trim(),
          email: fields.email.input.value.trim(),
          phone: document.getElementById('order-phone')?.value.trim() || 'N/A',
          service: fields.service.input.value,
          message: fields.message.input.value.trim(),
          timestamp: new Date().toISOString()
        };

        const existingLogs = JSON.parse(localStorage.getItem('openhearth_orders') || '[]');
        existingLogs.push(submissionData);
        localStorage.setItem('openhearth_orders', JSON.stringify(existingLogs));

        supportForm.style.display = 'none';
        if (successContainer) {
          successContainer.style.display = 'block';
          successContainer.setAttribute('aria-hidden', 'false');
        }
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        supportForm.reset();
        Object.keys(fields).forEach((key) => {
          const parentField = fields[key].input?.closest('.field');
          if (parentField) parentField.classList.remove('field--error');
        });
        if (successContainer) {
          successContainer.style.display = 'none';
          successContainer.setAttribute('aria-hidden', 'true');
        }
        supportForm.style.display = 'flex';
      });
    }
  }
  
});