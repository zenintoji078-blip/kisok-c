document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Interactive Cursor Glow Effect
    // ==========================================================================
    const cursorGlow = document.getElementById('cursorGlow');
    
    if (cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            // Smoothly move the background radial gradient to follow cursor
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
        
        // Hide glow when cursor leaves the window bounds
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '0.8';
        });
    }

    // ==========================================================================
    // Light/Dark Theme Switcher
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ==========================================================================
    // Sticky Header Scroll State
    // ==========================================================================
    const header = document.querySelector('.header');
    
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Initialize check

    // ==========================================================================
    // Mobile Navigation Menu Toggle
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            mobileMenuBtn.classList.toggle('mobileMenuOpen');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navbar.classList.remove('active');
                mobileMenuBtn.classList.remove('mobileMenuOpen');
            }
        });

        // Close menu on nav link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                mobileMenuBtn.classList.remove('mobileMenuOpen');
            });
        });
    }

    // ==========================================================================
    // Typewriter Text Effect
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter');
    const phrases = ["a BCA Student.", "a Python Developer.", "a Frontend Enthusiast.", "an Tech Learner."];
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        if (!typewriterElement) return;

        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle phrase transition states
        if (!isDeleting && characterIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full string
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(typeEffect, typingSpeed);
    };

    typeEffect();

    // ==========================================================================
    // Intersection Observer for Scroll Animations & Skill Bars
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    // Fade-in/scale revealing elements
    const elementRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(elem => {
        elementRevealObserver.observe(elem);
    });

    // Skill Bar filling animations when scrolled into view
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillProgressBars.forEach(bar => {
                        const targetWidth = bar.style.getPropertyValue('--width') || '0%';
                        bar.style.width = targetWidth;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        skillsObserver.observe(skillsSection);
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    
    const navScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-10% 0px -50% 0px'
    });

    sections.forEach(sec => {
        navScrollObserver.observe(sec);
    });

    // ==========================================================================
    // Project Grid Filtering
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Highlight clicked button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const categoryFilter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (categoryFilter === 'all' || cardCategory === categoryFilter) {
                    card.classList.remove('hide');
                    // Trigger dynamic entry animations on filter
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'all 0.4s ease';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // ==========================================================================
    // Contact Form Submission Handling
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (contactForm && submitBtn && successMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable submit button & show loading indicator
            submitBtn.disabled = true;
            const btnSpan = submitBtn.querySelector('span');
            const btnSpinner = submitBtn.querySelector('.submit-spinner');
            
            btnSpan.textContent = 'Sending...';
            btnSpinner.classList.remove('hide');

            // Simulate form submission API delay
            setTimeout(() => {
                // Hide Form & show success panel
                contactForm.classList.add('hide');
                successMessage.classList.remove('hide');
                
                // Reset submit button state
                submitBtn.disabled = false;
                btnSpan.textContent = 'Send Message';
                btnSpinner.classList.add('hide');
                
                // Reset inputs
                contactForm.reset();
            }, 1500);
        });
    }

    if (resetFormBtn && contactForm && successMessage) {
        resetFormBtn.addEventListener('click', () => {
            // Return back to form
            successMessage.classList.add('hide');
            contactForm.classList.remove('hide');
        });
    }
});
