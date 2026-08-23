document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ */
  /* Menú móvil                                                         */
  /* ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Acordeón FAQ accesible                                             */
  /* ------------------------------------------------------------------ */
  const triggers = document.querySelectorAll('.accordion__trigger');

  triggers.forEach((trigger) => {
    const panel = trigger.closest('.accordion__item').querySelector('.accordion__panel');
    panel.style.maxHeight = '0px';

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Cierra los demás paneles (comportamiento tipo acordeón único)
      triggers.forEach((otherTrigger) => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanel = otherTrigger.closest('.accordion__item').querySelector('.accordion__panel');
          otherPanel.style.maxHeight = '0px';
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ------------------------------------------------------------------ */
  /* Animación de aparición progresiva (respeta prefers-reduced-motion) */
  /* ------------------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------ */
  /* Validación del formulario de contacto                              */
  /* ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');

  if (form) {
    const status = document.getElementById('formStatus');

    const fields = {
      name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
      email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
      message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(key) {
      const { input, error } = fields[key];
      const field = input.closest('.form-field');
      let message = '';

      if (input.value.trim() === '') {
        message = 'Este campo es obligatorio.';
      } else if (key === 'email' && !emailPattern.test(input.value.trim())) {
        message = 'Introduce un email válido.';
      }

      error.textContent = message;
      field.classList.toggle('has-error', Boolean(message));
      return message === '';
    }

    Object.keys(fields).forEach((key) => {
      fields[key].input.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', (event) => {
      const validations = Object.keys(fields).map((key) => validateField(key));
      const isValid = validations.every(Boolean);

      if (!isValid) {
        event.preventDefault();
        status.textContent = 'Revisa los campos marcados antes de enviar.';
        return;
      }

      // Validación correcta: dejamos que el formulario se envíe de forma
      // normal a la URL indicada en el atributo "action" (por ejemplo, Formspree).
      status.textContent = 'Enviando...';
    });
  }

});
