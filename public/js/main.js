/**
 * ANTIGRAVITY MASTERY - MAIN LOGIC
 * Framework: GSAP 3.12.5 + ScrollTrigger + Lenis
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. FAIL-SAFE TIMEOUT (Remove preloader anyway after 6s)
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && preloader.style.display !== 'none') {
            console.warn('Preloader fail-safe triggered.');
            gsap.to(preloader, { opacity: 0, duration: 1, onComplete: () => { preloader.style.display = 'none'; startHeroAnimations(); } });
        }
    }, 6000);

    // 2. LENIS SMOOTH SCROLL (With check)
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
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
    } else {
        console.error('Lenis not found. Smooth scroll disabled.');
    }

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

    // 2. PRELOADER LOGIC
    const initPreloader = () => {
        const preloader = document.getElementById('preloader');
        const preloaderText = document.getElementById('preloader-text');
        
        if (!preloader) return;

        // Simulate step loading
        const steps = ["INITIALIZING SYSTEM...", "LOADING MODULES...", "BOOTING OPEN SQUAD...", "READY."];
        let stepIndex = 0;
        
        const interval = setInterval(() => {
            if(stepIndex < steps.length) {
                if (preloaderText) preloaderText.textContent = steps[stepIndex];
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
    };

    // Start preloader logic immediately
    initPreloader();


    // 1. HERO REVEAL ANIMATION
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent.trim();
        heroTitle.innerHTML = text.split('').map(char => 
            `<span class="inline-block opacity-0 translate-y-10 blur-sm">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        gsap.to('.hero h1 span', {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.05,
            duration: 1,
            ease: "power4.out",
            delay: 0.5
        });
    }


    // 3. GSAP & SCROLLYTELLING ENGINE
    gsap.registerPlugin(ScrollTrigger);

    // Accessibility Guard
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // HERO CANVAS LOGIC (Cinematic Loop)
    function initHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('hero-canvas-container');

        const img = new Image();
        // [BUG-007] Rule: onload BEFORE src
        img.onload = function() {
            render();
        };
        // Cinematic placeholder for Antigravity
        img.src = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop';

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = container.clientWidth * dpr;
            canvas.height = container.clientHeight * dpr;
            ctx.scale(dpr, dpr);
            render();
        }

        let frame = 0;
        function render() {
            if (!img.complete) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw with a subtle zoom/parallax effect
            const scale = 1.1 + Math.sin(frame * 0.005) * 0.05;
            const w = container.clientWidth * scale;
            const h = container.clientHeight * scale;
            const x = (container.clientWidth - w) / 2;
            const y = (container.clientHeight - h) / 2;
            
            ctx.drawImage(img, x, y, w, h);
            
            if (!prefersReducedMotion) {
                frame++;
                requestAnimationFrame(render);
            }
        }

        window.addEventListener('resize', resize);
        resize();
    }
    initHeroCanvas();

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

    // 5. DOTTED SURFACE (Ported from React Component)
    function initDottedSurface() {
        const container = document.getElementById('dotted-surface');
        if (!container || typeof THREE === 'undefined') return;

        const SEPARATION = 150;
        const AMOUNTX = 40;
        const AMOUNTY = 60;

        let scene, camera, renderer, geometry, material, points;
        let count = 0;

        function init() {
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x000000, 2000, 10000);

            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(0, 355, 1220);

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);

            container.appendChild(renderer.domElement);

            const positions = [];
            const colors = [];
            geometry = new THREE.BufferGeometry();

            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                    const y = 0;
                    const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
                    positions.push(x, y, z);
                    
                    // Light grey particles for dark theme
                    colors.push(0.8, 0.8, 0.8);
                }
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            material = new THREE.PointsMaterial({
                size: 8,
                vertexColors: true,
                transparent: true,
                opacity: 0.4,
                sizeAttenuation: true
            });

            points = new THREE.Points(geometry, material);
            scene.add(points);

            window.addEventListener('resize', onWindowResize);
            animate();
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        function render() {
            const positions = geometry.attributes.position.array;
            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    const index = i * 3;
                    positions[index + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
                    i++;
                }
            }
            geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
            count += 0.1;
        }

        init();
    }
    initDottedSurface();

    // 6. ICON CLOUD (TagCanvas)
    function initIconCloud() {
        try {
            TagCanvas.Start('icon-cloud-canvas', 'tech-tags', {
                textColour: '#ffffff',
                outlineColour: 'transparent',
                reverse: true,
                depth: 0.8,
                maxSpeed: 0.05,
                initial: [0.1, -0.1],
                textHeight: 18,
                wheelZoom: false,
                noSelect: true,
                freezeActive: true,
                textFont: 'Anton, sans-serif',
                weight: true,
                weightMode: 'both',
                weightFrom: 'data-weight',
                shadow: '#0066FF',
                shadowBlur: 3
            });
        } catch(e) {
            console.warn('TagCanvas failed to load', e);
        }
    }
    
    // 7. MOUSE TRACKING (Spotlight)
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.glass');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 8. TECH SLIDER ANIMATION (GSAP)
    function initTechSlider() {
        const slider = document.querySelector('.infinite-slider');
        if (slider) {
            gsap.fromTo(slider, {
                xPercent: 0
            }, {
                xPercent: -50,
                duration: 60,
                ease: "none",
                repeat: -1,
                overwrite: true
            });
        }
    }
    initTechSlider();

    // Wait a bit for font loading
    setTimeout(initIconCloud, 1000);
});
