/**
 * navigation.js - Gestión de la barra de navegación, menú responsive y scroll accesible
 */

export function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav__link');
  const sections = document.querySelectorAll('section[id]');

  // Control del menú hamburguesa móvil
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileNav.classList.toggle('is-open');
    });

    // Cerrar menú móvil al hacer click en cualquier enlace interno
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
      });
    });
  }

  // Sombra dinámica en la cabecera al hacer scroll
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('site-header--scrolled');
    } else {
      siteHeader.classList.remove('site-header--scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Resaltado de sección activa mediante Intersection Observer
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('nav-link--active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('nav-link--active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }
}
