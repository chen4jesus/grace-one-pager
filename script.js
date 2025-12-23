/**
 * Grace Community Fellowship - Church Website
 * Main JavaScript functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initScrollEffects();
    initCounterAnimation();
    initContactForm();
    initAccessibility();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !navMenu) return;

    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');

        // Animate hamburger to X
        const spans = mobileToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');

                // Reset hamburger icon
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');

            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');

                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        }, 250);
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's just '#'
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Effects
 * - Navbar background on scroll
 * - Active nav link highlighting
 * - Fade-in animations on scroll
 */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar background change on scroll
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active nav link highlighting
    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });

                    // Add active class to corresponding link
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Fade-in animations for elements
    const fadeElements = document.querySelectorAll('.about-card, .service-card, .ministry-item');

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObserver.observe(el);
        });
    }
}

/**
 * Counter Animation for Community Stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.highlight-number');

    if (counters.length === 0) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += step;

            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            interest: formData.get('interest'),
            message: formData.get('message')
        };

        // Validate form
        if (!validateForm(data)) {
            return;
        }

        // Show success message (in a real application, you would send this to a server)
        showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
        form.reset();
    });

    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });
}

/**
 * Form Validation
 */
function validateForm(data) {
    let isValid = true;

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFormMessage('Please enter a valid name.', 'error');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return false;
    }

    // Interest validation
    if (!data.interest) {
        showFormMessage('Please select an area of interest.', 'error');
        return false;
    }

    return true;
}

/**
 * Individual Input Validation
 */
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;

    switch (input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            break;
        case 'text':
            isValid = value.length >= 2;
            break;
        case 'select-one':
            isValid = value !== '';
            break;
        default:
            isValid = true;
    }

    if (!isValid && value !== '') {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }

    return isValid;
}

/**
 * Show Form Message
 */
function showFormMessage(message, type = 'success') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease;
        ${type === 'success' ?
            'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' :
            'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;

    // Add slideDown animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Insert message after form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageEl, form.nextSibling);

    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-10px)';
            messageEl.style.transition = 'all 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
}

/**
 * Accessibility Features
 */
function initAccessibility() {
    // Handle Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle?.classList.remove('active');
                mobileToggle?.focus();
            }
        }
    });

    // Add focus-visible polyfill-like behavior for better keyboard navigation
    document.body.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse');
    });

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
}

/**
 * Utility: Debounce Function
 */
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle Function
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Log that script has loaded successfully
console.log('Grace Community Fellowship website loaded successfully ✝');

/**
 * Performance: Add passive event listeners for better scroll performance
 */
document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchmove', function() {}, { passive: true });