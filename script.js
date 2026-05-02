document.addEventListener('DOMContentLoaded', () => {
    // Scroll Observer for Animations
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counters
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2500; 
                    const step = target / (duration / 16); 
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.innerText = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));

    // Advanced 3D Tilt Effect for Bento Cards
    const tiltElements = document.querySelectorAll('.feature-card, .hardware-card, .data-card');
    
    // Use matchMedia to disable 3D on mobile to prevent jank
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    if (!isMobile) {
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / centerX;
                const moveY = (y - centerY) / centerY;
                
                const maxTilt = 6;
                // Add a dynamic tilt using CSS rotate and perspective with hardware acceleration
                el.style.transform = `perspective(1200px) rotateX(${-moveY * maxTilt}deg) rotateY(${moveX * maxTilt}deg) translateZ(10px)`;
                el.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
                
                if (el.classList.contains('hover-glow')) {
                    el.style.boxShadow = `${-moveX * 20}px ${-moveY * 20}px 30px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
                }
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)`;
                el.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.boxShadow = ''; // Reset to class default
            });
        });
    }

    // Refined, Dynamic Background Parallax & Layout Transforming
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        const sections = document.querySelectorAll('header, section');
        
        let lastKnownScrollPosition = 0;
        let ticking = false;

        // Crossfade observer to determine the actively viewed section
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const tag = entry.target.tagName.toLowerCase();
                    const id = entry.target.id;
                    
                    if (tag === 'header' || id === 'problem' || id === 'cta') {
                        activateLayer('bg-drone');
                    } else if (id === 'howitworks' || id === 'stack' || id === 'benefits') {
                        activateLayer('bg-rover');
                    } else if (id === 'solution' || id === 'usecases' || id === 'dashboard' || id === 'business' || id === 'traction' || id === 'roadmap' || id === 'trust') {
                        activateLayer('bg-diagram');
                    }
                }
            });
        }, { threshold: 0.25 });

        sections.forEach(sec => sectionObserver.observe(sec));

        function activateLayer(id) {
            parallaxLayers.forEach(layer => {
                if (layer.id === id) {
                    layer.classList.add('active');
                } else {
                    layer.classList.remove('active');
                }
            });
        }

        function updateParallax(scrolled) {
            parallaxLayers.forEach(layer => {
                // Slower scale and depth transition to guarantee layers remain fully bounded through tall document scrolls
                const scale = Math.max(0.9, 1 - (scrolled * 0.0001));
                const translateY = scrolled * 0.15; 
                layer.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            });
        }

        window.addEventListener('scroll', () => {
            lastKnownScrollPosition = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateParallax(lastKnownScrollPosition);
                    ticking = false;
                });
                ticking = true;
            }
        });

});
