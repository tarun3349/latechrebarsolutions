// Mobile menu toggle
let hamburger, navMenu;

// Active section state management
let activeSection = null;

function removeActiveState() {
    if (activeSection) {
        activeSection.classList.remove('section-active');
        activeSection = null;
    }
}

function setActiveSection(sectionId) {
    // Remove previous active state
    removeActiveState();
    
    // Find the section
    const section = document.querySelector(sectionId);
    if (section) {
        // Small delay to ensure smooth transition
        setTimeout(() => {
            section.classList.add('section-active');
            activeSection = section;
            
            // Remove active state after 4 seconds if still active
            setTimeout(() => {
                if (activeSection === section) {
                    removeActiveState();
                }
            }, 4000);
        }, 100);
    }
}

// Smooth scrolling function with navbar offset
function scrollToSection(href) {
    const target = document.querySelector(href);
    
    if (!target) {
        return false;
    }
    
    // Set active state for the target section
    setActiveSection(href);
    
    // Get navbar height dynamically
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 90;
    
    // Calculate target position with offset
    const targetPosition = target.offsetTop - navbarHeight;
    
    // Smooth scroll to target
    window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
    });
    
    // Update URL hash
    if (history.pushState) {
        history.pushState(null, null, href);
    }
    
    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
    
    return true;
}

// Initialize navigation
function initNavigation() {
    // Get elements
    hamburger = document.querySelector('.hamburger');
    navMenu = document.querySelector('.nav-menu');
    
        // Mobile menu toggle with enhanced animations
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    document.body.classList.add('menu-open');
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                } else {
                    document.body.classList.remove('menu-open');
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu && navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            }
        });

        // Close menu on scroll
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }, 100);
            }
        });
    }
    
    // Handle navigation menu links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const href = this.getAttribute('href');
            if (href && href !== '#' && href !== '#!') {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
                scrollToSection(href);
            }
            return false;
        });
    });
    
    // Handle footer links
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const href = this.getAttribute('href');
            if (href && href !== '#' && href !== '#!') {
                scrollToSection(href);
            }
            return false;
        });
    });
    
    // Handle other anchor links (CTA buttons, etc.)
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        // Skip if it's a nav or footer link (already handled)
        if (anchor.closest('.nav-menu') || anchor.closest('.footer-links')) {
            return;
        }
        
        const href = anchor.getAttribute('href');
        if (href && href !== '#' && href !== '#!') {
            e.preventDefault();
            e.stopPropagation();
            scrollToSection(href);
        }
    }, false);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}


// Set active navigation based on scroll position
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function updateActiveNav() {
        let current = '';
        const scrollY = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 90;
        
        // Check if we've scrolled away from the active section
        if (activeSection) {
            const activeSectionTop = activeSection.offsetTop - navbarHeight;
            const activeSectionHeight = activeSection.offsetHeight;
            const activeSectionBottom = activeSectionTop + activeSectionHeight;
            
            // Remove active state if scrolled significantly away from the section
            if (scrollY < activeSectionTop - 300 || scrollY > activeSectionBottom + 300) {
                removeActiveState();
            }
        }
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                (current === 'home' && link.getAttribute('href') === '#home')) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
});

// Smooth reveal animations for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(section);
});

// Animate elements on scroll with stagger effect
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate-fade-in-up');
            }, index * 50); // Reduced from 100ms to 50ms
        }
    });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.service-card, .feature, .market').forEach((el, index) => {
    el.classList.add(`animate-delay-${(index % 5) + 1}`);
    observer.observe(el);
});

// Special observer for service items with sequential animation
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const item = entry.target;
            const details = item.querySelector('.service-details');
            
            // Animate details
            setTimeout(() => {
                if (details) {
                    details.style.opacity = '1';
                    details.style.transform = 'translateY(0)';
                }
            }, index * 150);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-item').forEach((el) => {
    serviceObserver.observe(el);
});

// Special animations for stats
document.querySelectorAll('.stat').forEach((stat, index) => {
    stat.classList.add(`animate-delay-${(index % 5) + 1}`);
    observer.observe(stat);
});

// Enhanced counter animation for stats
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    const isPercentage = suffix.includes('%');

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
            element.style.animation = 'bounceIn 0.5s ease';
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 500);
        } else {
            const displayValue = isPercentage ? Math.floor(current) : Math.floor(current);
            element.textContent = displayValue + suffix;
        }
    }, stepTime);
}

// Animate stat numbers
document.querySelectorAll('.stat-number').forEach(stat => {
    const target = parseInt(stat.dataset.target || stat.textContent.replace(/[^\d]/g, ''));
    const suffix = stat.textContent.includes('%') ? '%' : '+';
    
    if (!isNaN(target) && target > 0) {
        stat.textContent = '0' + suffix;
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(stat, target, suffix);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(stat);
    }
});

// Legacy support for existing stat elements
document.querySelectorAll('.stat h3').forEach(stat => {
    const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
    const suffix = stat.textContent.replace(/\d/g, '');

    stat.dataset.suffix = suffix;

    if (!isNaN(target) && target > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(stat, target, suffix);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(stat);
    }
});

// Add hover effects to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect for hero text (optional)
function typeWriter(element, text, speed = 30) { // Reduced from 50ms to 30ms
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 30); // Reduced from 100ms to 30ms
        }, 200); // Reduced from 500ms to 200ms
    }
});

// Mobile detection and enhancements
function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Mobile-specific scroll animations
function initMobileScrollAnimations() {
    if (!isMobile()) return;

    // Services Grid - Mobile slide animation
    const serviceCards = document.querySelectorAll('.services-grid .service-card');
    serviceCards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
    });

    // Stats Grid - Mobile zoom animation
    const statItems = document.querySelectorAll('.stats-grid .stat-item');
    statItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.5)';
    });

    // Features Grid - Mobile rotate animation
    const features = document.querySelectorAll('.features-grid .feature');
    features.forEach((feature) => {
        feature.style.opacity = '0';
        feature.style.transform = 'rotate(-90deg) scale(0.5)';
    });

    // Markets Grid - Mobile slide animation
    const markets = document.querySelectorAll('.markets-grid .market');
    markets.forEach((market) => {
        market.style.opacity = '0';
        market.style.transform = 'translateX(30px)';
    });

    // Portfolio Grid - Mobile flip animation
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');
    portfolioItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'rotateY(-90deg)';
    });

    // Combined observer for all grids
    const mobileObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    if (entry.target.classList.contains('service-card') || entry.target.classList.contains('market')) {
                        entry.target.style.transform = 'translateX(0)';
                    } else if (entry.target.classList.contains('stat-item')) {
                        entry.target.style.transform = 'scale(1)';
                    } else if (entry.target.classList.contains('feature')) {
                        entry.target.style.transform = 'rotate(0deg) scale(1)';
                    } else if (entry.target.classList.contains('portfolio-item')) {
                        entry.target.style.transform = 'rotateY(0deg)';
                    } else {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }
                }, index * 100);
                mobileObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const allGridItems = document.querySelectorAll('.service-card, .feature, .market, .service-item, .portfolio-item, .stat-item');
    allGridItems.forEach(el => {
        mobileObserver.observe(el);
    });
}

// Mobile touch feedback
function initMobileTouchFeedback() {
    if (!isMobile()) return;

    const touchElements = document.querySelectorAll('.service-card, .feature, .market, .service-item, .portfolio-item, .cta-button, .view-all-button');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transition = 'all 0.1s ease';
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        }, { passive: true });
    });
}

// Mobile scroll progress indicator
function initMobileScrollProgress() {
    if (!isMobile()) return;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 10000;
        transition: width 0.1s ease;
        box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

// Mobile image lazy loading
function initMobileImageLoading() {
    if (!isMobile()) return;

    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => {
        if (!img.classList.contains('loaded')) {
            imageObserver.observe(img);
        }
    });
}

// Mobile section reveal on scroll
function initMobileSectionReveal() {
    if (!isMobile()) return;

    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Mobile parallax effect
function initMobileParallax() {
    if (!isMobile()) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll < window.innerHeight) {
            const rate = currentScroll * 0.3;
            hero.style.transform = `translateY(${rate}px)`;
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

// Mobile vibration feedback (if supported)
function mobileVibrate(pattern = [10]) {
    if (!isMobile()) return;
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Add vibration to button clicks on mobile
function initMobileVibration() {
    if (!isMobile()) return;

    const buttons = document.querySelectorAll('.cta-button, .view-all-button, .submit-button, .whatsapp-button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            mobileVibrate([5]);
        }, { passive: true });
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Mobile-specific enhancements
    if (isMobile()) {
        document.body.classList.add('mobile-device');
        initMobileScrollAnimations();
        initMobileTouchFeedback();
        initMobileScrollProgress();
        initMobileImageLoading();
        initMobileSectionReveal();
        initMobileParallax();
        initMobileVibration();
    } else {
        // Create floating particles for hero section (desktop only)
        createParticles();
        
        // Add scroll-triggered animations
        initScrollAnimations();
        
        // Add cursor effect (desktop only)
        initCursorEffect();
    }
});

// Create floating particles effect
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'hero-particles';
    hero.appendChild(particlesContainer);
    
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Advanced scroll animations with grid-specific effects
function initScrollAnimations() {
    // Services Grid - Slide from left/right
    const serviceCards = document.querySelectorAll('.services-grid .service-card');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0) rotate(0deg)';
                }, index * 150);
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    serviceCards.forEach(card => {
        serviceObserver.observe(card);
    });

    // Stats Grid - Zoom in effect
    const statItems = document.querySelectorAll('.stats-grid .stat-item');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }, index * 100);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    statItems.forEach(item => {
        statsObserver.observe(item);
    });

    // Features Grid - Rotate in effect
    const features = document.querySelectorAll('.features-grid .feature');
    const featuresObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'rotate(0deg) scale(1)';
                }, index * 120);
                featuresObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    features.forEach(feature => {
        featuresObserver.observe(feature);
    });

    // Markets Grid - Slide from sides
    const markets = document.querySelectorAll('.markets-grid .market');
    const marketsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0) rotate(0deg)';
                }, index * 150);
                marketsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    markets.forEach(market => {
        marketsObserver.observe(market);
    });

    // Portfolio Grid - Flip in effect
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'rotateY(0deg)';
                }, index * 100);
                portfolioObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    portfolioItems.forEach(item => {
        portfolioObserver.observe(item);
    });
}

// Cursor effect
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid rgba(102, 126, 234, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    cursorFollower.style.cssText = `
        width: 8px;
        height: 8px;
        background: rgba(102, 126, 234, 0.8);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursorFollower);
    
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        cursorFollower.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursorFollower.style.left = e.clientX - 4 + 'px';
            cursorFollower.style.top = e.clientY - 4 + 'px';
        });
        
        document.querySelectorAll('a, button, .service-card, .feature').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'rgba(102, 126, 234, 1)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'rgba(102, 126, 234, 0.5)';
            });
        });
    }
}

// Enhanced button interactions
document.querySelectorAll('.cta-button, .view-all-button, .submit-button').forEach(button => {
    // Ripple effect on click
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
    
    // Magnetic effect
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced WhatsApp button animation
const whatsappButton = document.querySelector('.whatsapp-button');
if (whatsappButton) {
    // Pulse notification effect
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        background: #ff4757;
        border-radius: 50%;
        border: 3px solid white;
        animation: pulse 2s infinite;
        pointer-events: none;
    `;
    whatsappButton.appendChild(notification);
    
    // Click animation
    whatsappButton.addEventListener('click', function() {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Magnetic effect
    whatsappButton.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.1)`;
    });
    
    whatsappButton.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
}

// Contact form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Show loading state
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1000); // Reduced from 2000ms to 1000ms
    });
}