document.addEventListener('DOMContentLoaded', () => {

// --- Background Effects Generation ---
  
  // Generate Petals (stronger effect)
  const petalContainer = document.getElementById("petals-container");
  if (petalContainer) {
    // create more petals for a fuller, raining effect
    for (let i = 0; i < 100; i++) {
      const petal = document.createElement("div");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      // shorter random delay so petals stream in continuously
      const delay = (Math.random() * 12).toFixed(2);
      const duration = (10 + Math.random() * 26).toFixed(2);
      petal.style.animationDelay = `${delay}s`;
      petal.style.animationDuration = `${duration}s`;
      // expose CSS var for duration if needed
      petal.style.setProperty('--fall-duration', `${duration}s`);
      // slight size variance
      const size = 10 + Math.floor(Math.random() * 25);
      petal.style.width = `${size}px`;
      petal.style.height = `${Math.round(size * 1.4)}px`;
      // petal type (0-2) matches CSS variants
      const petalType = Math.floor(Math.random() * 3);
      petal.setAttribute('data-type', petalType.toString());
      // randomize opacity so some petals appear darker/stronger
      const petalOpacity = (15 + Math.random() * 100).toFixed(2); // 0.50 - 1.00
      petal.style.setProperty('--petal-max-opacity', petalOpacity);
      // mark especially visible petals for stronger shadow/highlight
      if (Number(petalOpacity) > 100) {
        petal.classList.add('petal-strong');
        petal.style.zIndex = 50;
      }
      petalContainer.appendChild(petal);
    }
  }

  // Generate Glowing Particles (50)
  const particleContainer = document.getElementById("particles-container");
  if (particleContainer) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${3 + Math.random() * 4}s`;
      particleContainer.appendChild(particle);
    }
  }

  // Generate Floating Circles (15)
  const circlesContainer = document.getElementById("circles-container");
  if (circlesContainer) {
    for (let i = 0; i < 15; i++) {
      const circle = document.createElement("div");
      circle.className = "floating-circle";
      const size = 40 + Math.random() * 160;
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
      circle.style.left = `${Math.random() * 100}%`;
      circle.style.top = `${Math.random() * 100}%`;
      circle.style.animationDelay = `${Math.random() * 10}s`;
      circle.style.animationDuration = `${20 + Math.random() * 20}s`;
      const colorType = Math.floor(Math.random() * 3);
      circle.setAttribute('data-color', colorType.toString());
      circlesContainer.appendChild(circle);
    }
  }


  // --- Scroll Logic ---
  
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const animatedHeart = document.getElementById('animated-heart-wrapper');
  const navbar = document.getElementById('navbar');

  // Add initial class to navbar to trigger its entry animation
  setTimeout(() => {
    if (navbar) navbar.classList.add('is-visible');
  }, 100);

  window.addEventListener('scroll', () => {
    // Show scroll to top button if scrolled more than 300px
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('is-visible');
    } else {
      scrollToTopBtn.classList.remove('is-visible');
    }

    // Hide animated heart if scrolled past 80vh
    if (animatedHeart) {
      if (window.scrollY < window.innerHeight * 0.8) {
        animatedHeart.style.opacity = '1';
        animatedHeart.style.pointerEvents = 'auto'; // allow interaction if any
      } else {
        animatedHeart.style.opacity = '0';
        animatedHeart.style.pointerEvents = 'none';
      }
    }
  });


  // --- Smooth Scrolling for Navigation ---
  
  const navButtons = document.querySelectorAll('.nav-links button');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Scroll to top button action
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Action for hero buttons
  const heroPrimaryBtn = document.querySelector('.hero-section .btn-primary');
  if (heroPrimaryBtn) {
    heroPrimaryBtn.addEventListener('click', () => {
      const targetId = heroPrimaryBtn.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const heroSecondaryBtn = document.querySelector('.hero-section .btn-secondary');
  if (heroSecondaryBtn) {
    heroSecondaryBtn.addEventListener('click', () => {
      const targetId = heroSecondaryBtn.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  // --- Intersection Observer for Scroll Animations ---
  // Replicates Framer Motion's whileInView

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% visible
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // only animate once like viewport={{ once: true }}
      }
    });
  }, observerOptions);

  // Select all elements that need to animate in on scroll
  const animatableElements = document.querySelectorAll(
    '.fade-in-left, .fade-in-right, .fade-in-up, .slide-up, .slide-up-delay-0, .slide-up-delay-1, .slide-up-delay-2, .zoom-in, .zoom-in-delay, .zoom-in-delay-0, .zoom-in-delay-1, .zoom-in-delay-2'
  );

  animatableElements.forEach(el => {
    scrollObserver.observe(el);
  });

  // When a section becomes visible, fade-in the petals layer for that "page".
  const sections = document.querySelectorAll('section');
  if (petalContainer && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          petalContainer.classList.add('active');
        } else if (!entry.isIntersecting) {
          // remove active when no section is prominently visible (small delay to avoid flicker)
          setTimeout(() => {
            // if no section currently has is-visible, hide petals
            const anyVisible = Array.from(sections).some(s => s.classList.contains('is-visible'));
            if (!anyVisible) petalContainer.classList.remove('active');
          }, 250);
        }
      });
    }, { threshold: [0.25] });

    sections.forEach(s => sectionObserver.observe(s));
  }

  // --- Swiper Initialization ---
  const swiperElement = document.querySelector('.swiper');
  if (swiperElement) {
    new Swiper('.swiper', {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
      centeredSlides: true,
      speed: 700,

      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 25 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  }

});
