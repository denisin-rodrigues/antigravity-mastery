/**
 * ANTIGRAVITY MASTERY - MAIN LOGIC
 * Framework: GSAP 3.12.5 + ScrollTrigger + Lenis
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. LENIS SMOOTH SCROLL
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. PRELOADER LOGIC
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        const preloaderText = document.getElementById('preloader-text');
        
        // Simulate step loading
        const steps = ["INITIALIZING SYSTEM...", "LOADING MODULES...", "BOOTING OPEN SQUAD...", "READY."];
        let stepIndex = 0;
        
        const interval = setInterval(() => {
            if(stepIndex < steps.length) {
                preloaderText.textContent = steps[stepIndex];
                stepIndex++;
            } else {
                clearInterval(interval);
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        preloader.style.display = 'none';
                        startHeroAnimations();
                    }
                });
            }
        }, 400);
    });

    // 3. GSAP ANIMATIONS
    gsap.registerPlugin(ScrollTrigger);

    // Floating Nav Background on Scroll
    ScrollTrigger.create({
        start: "top -100",
        onUpdate: (self) => {
            const nav = document.getElementById('nav-pill');
            if (self.direction === 1) {
                nav.classList.add('nav-scrolled');
            } else if (self.scroll() < 100) {
                nav.classList.remove('nav-scrolled');
            }
        }
    });

    // Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: "expo.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Terminal Debug Animation
    const terminalSection = document.getElementById('problema');
    const terminalAfter = document.getElementById('terminal-after');
    
    ScrollTrigger.create({
        trigger: terminalSection,
        start: "top 60%",
        onEnter: () => {
            gsap.to(terminalAfter, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 1.5,
                ease: "power2.out"
            });
        }
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('#faq .glass');
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const content = item.querySelector('div:last-child');
        
        // Hide content initially via JS to avoid layout shift
        gsap.set(content, { height: 0, opacity: 0, display: 'none' });

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close others
            faqItems.forEach(otherItem => {
                if(otherItem !== item && otherItem.classList.contains('active')) {
                    const otherContent = otherItem.querySelector('div:last-child');
                    const otherIcon = otherItem.querySelector('span:last-child');
                    gsap.to(otherContent, { height: 0, opacity: 0, duration: 0.3, onComplete: () => otherContent.style.display = 'none' });
                    gsap.to(otherIcon, { rotate: 0, duration: 0.3 });
                    otherItem.classList.remove('active');
                }
            });

            const icon = button.querySelector('span:last-child');
            if(isOpen) {
                gsap.to(content, { height: 0, opacity: 0, duration: 0.3, onComplete: () => content.style.display = 'none' });
                gsap.to(icon, { rotate: 0, duration: 0.3 });
                item.classList.remove('active');
            } else {
                content.style.display = 'block';
                gsap.to(content, { height: 'auto', opacity: 1, duration: 0.5, ease: "power2.out" });
                gsap.to(icon, { rotate: 45, duration: 0.3 });
                item.classList.add('active');
            }
        });
    });

    // Hero Init Animation
    function startHeroAnimations() {
        gsap.to("#hero .reveal", {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "expo.out"
        });
    }

    // 4. SECURITY & UTILS
    // Escape Key Handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any hypothetical modals
        }
    });

    // Form demo alert
    const ctaButtons = document.querySelectorAll('a[href^="https://pay.hotmart.com"]');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // e.preventDefault();
            // console.log("Redirecionando para checkout Hotmart...");
        });
    });
});
