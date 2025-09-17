'use strict';

/**
 * Gamics - scriptContacto.js
 * Versión: Actualizada (preserva header + añade animaciones y mejoras al contenido)
 */

/* ---------- NAVBAR FUNCTIONALITY (preservado) ---------- */
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navbarToggler = document.querySelector("[data-nav-toggler]");

if (navbarToggler) {
  navbarToggler.addEventListener("click", function () {
    navbar.classList.toggle("active");
    this.classList.toggle("active");
  });
}

// Close navbar when clicking on links
if (navbarLinks.length) {
  navbarLinks.forEach(link => {
    link.addEventListener("click", function () {
      navbar.classList.remove("active");
      if (navbarToggler) navbarToggler.classList.remove("active");
    });
  });
}

/* ---------- SEARCH FUNCTIONALITY (preservado) ---------- */
const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const searchBox = document.querySelector("[data-search-box]");

if (searchTogglers && searchBox) {
  searchTogglers.forEach(btn => {
    btn.addEventListener("click", function () {
      searchBox.classList.toggle("active");
    });
  });

  // Close search when pressing Escape
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && searchBox.classList.contains("active")) {
      searchBox.classList.remove("active");
    }
  });
}

/* ---------- HEADER SCROLL EFFECT (preservado) ---------- */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 200) {
    if (header) header.classList.add("active");
    if (backTopBtn) backTopBtn.classList.add("active");
  } else {
    if (header) header.classList.remove("active");
    if (backTopBtn) backTopBtn.classList.remove("active");
  }
});

/* ---------- CONTACT FORM & INPUT INTERACTIONS (MEJORADO) ---------- */

const contactForm = document.querySelector('.form');
const formInputs = document.querySelectorAll('.form-input, .form-textarea');
const formBtn = document.querySelector('.form-btn');

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* Notification system (creates styles once) */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  // container
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');

  notification.innerHTML = `
    <div class="notification-content">
      <ion-icon name="${type === 'success' ? 'checkmark-circle' : type === 'error' ? 'alert-circle' : 'information-circle'}"></ion-icon>
      <span>${message}</span>
    </div>
    <button class="notification-close" aria-label="cerrar notificación">
      <ion-icon name="close"></ion-icon>
    </button>
  `;

  // close button behavior
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });

  document.body.appendChild(notification);

  // auto remove
  setTimeout(() => {
    if (notification.parentElement) notification.remove();
  }, 5000);
}

/* Loading state for button */
const originalBtnText = formBtn ? formBtn.textContent : 'Enviar';

function setButtonLoading(isLoading) {
  if (!formBtn) return;
  if (isLoading) {
    formBtn.innerHTML = `
      <span style="display:flex;align-items:center;gap:10px">
        <span style="width:16px;height:16px;border:2px solid transparent;border-top:2px solid currentColor;border-radius:50%;animation:spin 1s linear infinite"></span>
        Enviando...
      </span>
    `;
    formBtn.disabled = true;
  } else {
    formBtn.textContent = originalBtnText;
    formBtn.disabled = false;
  }
}

/* single submit handler (clean + shows loading) */
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();

    if (!name || !email || !subject || !message) {
      showNotification('Por favor, completa todos los campos', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Por favor, ingresa un email válido', 'error');
      return;
    }

    // show loading
    setButtonLoading(true);

    // simulate api call
    setTimeout(() => {
      setButtonLoading(false);
      showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');

      // reset
      contactForm.reset();
      formInputs.forEach(input => {
        input.blur();
        if (input.parentElement) input.parentElement.classList.remove('focused');
      });
    }, 1200);
  });
}

/* INPUT ANIMATIONS: focus / blur / input -> toggle .focused on .form-group */
formInputs.forEach(input => {
  const group = input.closest('.form-group');

  input.addEventListener('focus', function() {
    if (group) group.classList.add('focused');
  });

  input.addEventListener('blur', function() {
    if (group && !this.value) group.classList.remove('focused');
  });

  input.addEventListener('input', function() {
    if (group) {
      if (this.value) group.classList.add('focused');
      else group.classList.remove('focused');
    }
  });
});

/* ---------- CONTACT CARDS ANIMATION & PARALLAX HOVER ---------- */
const contactCards = document.querySelectorAll('.contact-card');

const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const cardObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      entry.target.style.opacity = '1';
    }
  });
}, observerOptions);

contactCards.forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.animationDelay = `${index * 0.08}s`;
  cardObserver.observe(card);

  // small tilt effect
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(6px)`;
    card.style.transition = 'transform 0.08s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.35s cubic-bezier(.2,.9,.2,1)';
  });
});

/* add fadeInUp keyframes (css-insert if not present) */
(function addCardAnimationStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }`;
  document.head.appendChild(style);
})();

/* ---------- SMOOTH SCROLL FOR ANCHOR LINKS (preservado) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // if href is just '#' ignore
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ---------- BACK TO TOP (mejorado) ---------- */
const backTopAnchor = document.querySelector('[data-back-top-btn]');

if (backTopAnchor) {
  backTopAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- LOG de carga ---------- */
console.log('Gamics Contact Page - scriptContacto.js cargado correctamente ✅');
