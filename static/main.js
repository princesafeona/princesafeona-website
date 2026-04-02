const initHomepage = () => {
    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingCounter = document.getElementById("loading-counter");
    const heroVideo = document.getElementById("hero-video");
    const soundToggle = document.getElementById("sound-toggle");
    const aboutTrigger = document.getElementById("about-trigger");
    const aboutLayer = document.getElementById("about-layer");
    const aboutClose = document.getElementById("about-close");
    const customCursor = document.getElementById("custom-cursor");
    const mobileHeroVideo = document.getElementById("mobile-hero-video");
    const mobileAboutVideo = document.getElementById("mobile-about-video");
    const mobileSoundToggle = document.getElementById("mobile-sound-toggle");
    const mobileMenuTrigger = document.getElementById("mobile-menu-trigger");
    const mobileMenuScreen = document.getElementById("mobile-menu-screen");
    const mobileMenuClose = document.getElementById("mobile-menu-close");
    const mobileAboutScreen = document.getElementById("mobile-about-screen");
    const mobileAboutTrigger = document.getElementById("mobile-about-trigger");
    const mobileAboutClose = document.getElementById("mobile-about-close");

    if (heroVideo) {
        heroVideo.muted = true;
    }

    if (mobileHeroVideo) {
        mobileHeroVideo.muted = true;
    }

    if (mobileAboutVideo) {
        mobileAboutVideo.muted = true;
    }

    if (soundToggle && heroVideo) {
        const updateSoundLabel = () => {
            if (heroVideo.muted) {
                soundToggle.textContent = "SOUND OFF";
                soundToggle.classList.add("is-muted");
                soundToggle.setAttribute("aria-pressed", "false");
            } else {
                soundToggle.textContent = "SOUND ON";
                soundToggle.classList.remove("is-muted");
                soundToggle.setAttribute("aria-pressed", "true");
            }
        };

        updateSoundLabel();

        soundToggle.addEventListener("click", async () => {
            heroVideo.muted = !heroVideo.muted;

            if (!heroVideo.muted) {
                try {
                    await heroVideo.play();
                } catch (error) {
                    heroVideo.muted = true;
                }
            }

            updateSoundLabel();
        });
    }

    if (mobileSoundToggle && mobileHeroVideo) {
        const updateMobileSound = () => {
            if (mobileHeroVideo.muted) {
                mobileSoundToggle.textContent = "SOUND OFF";
                mobileSoundToggle.classList.add("is-muted");
                mobileSoundToggle.setAttribute("aria-pressed", "false");
            } else {
                mobileSoundToggle.textContent = "SOUND ON";
                mobileSoundToggle.classList.remove("is-muted");
                mobileSoundToggle.setAttribute("aria-pressed", "true");
            }
        };

        updateMobileSound();

        mobileSoundToggle.addEventListener("click", async () => {
            mobileHeroVideo.muted = !mobileHeroVideo.muted;

            if (!mobileHeroVideo.muted) {
                try {
                    await mobileHeroVideo.play();
                } catch (error) {
                    mobileHeroVideo.muted = true;
                }
            }

            updateMobileSound();
        });
    }

    if (aboutTrigger && aboutLayer && aboutClose) {
        const isAboutOpen = () => aboutLayer.classList.contains("is-visible");

        const openAbout = () => {
            document.body.classList.add("about-open");
            aboutLayer.classList.add("is-visible");
            aboutLayer.setAttribute("aria-hidden", "false");
        };

        const closeAbout = () => {
            document.body.classList.remove("about-open");
            aboutLayer.classList.remove("is-visible");
            aboutLayer.setAttribute("aria-hidden", "true");
        };

        aboutTrigger.addEventListener("click", () => {
            if (isAboutOpen()) {
                closeAbout();
            } else {
                openAbout();
            }
        });
        aboutClose.addEventListener("click", closeAbout);

        document.addEventListener("click", (event) => {
            if (!isAboutOpen()) {
                return;
            }

            const clickedInsideFrame = event.target.closest(".video-frame");
            const clickedTrigger = event.target.closest("#about-trigger");

            if (!clickedInsideFrame && !clickedTrigger) {
                closeAbout();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && isAboutOpen()) {
                closeAbout();
            }
        });
    }

    if (mobileMenuTrigger && mobileMenuScreen && mobileMenuClose && mobileAboutScreen && mobileAboutTrigger && mobileAboutClose) {
        const openMobileMenu = () => {
            mobileMenuScreen.classList.add("is-visible");
            mobileMenuScreen.setAttribute("aria-hidden", "false");
        };

        const closeMobileMenu = () => {
            mobileMenuScreen.classList.remove("is-visible");
            mobileMenuScreen.setAttribute("aria-hidden", "true");
        };

        const openMobileAbout = () => {
            if (mobileHeroVideo && mobileAboutVideo) {
                mobileAboutVideo.currentTime = mobileHeroVideo.currentTime || 0;
                mobileAboutVideo.play().catch(() => {});
            }

            mobileAboutScreen.classList.add("is-visible");
            mobileAboutScreen.setAttribute("aria-hidden", "false");
            closeMobileMenu();
        };

        const closeMobileAbout = () => {
            mobileAboutScreen.classList.remove("is-visible");
            mobileAboutScreen.setAttribute("aria-hidden", "true");
            openMobileMenu();
        };

        mobileMenuTrigger.addEventListener("click", openMobileMenu);
        mobileMenuClose.addEventListener("click", closeMobileMenu);
        mobileAboutTrigger.addEventListener("click", openMobileAbout);
        mobileAboutClose.addEventListener("click", closeMobileAbout);
    }

    if (loadingOverlay && loadingCounter) {
        const duration = 4000;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(eased * 100);

            loadingCounter.textContent = `(${value}%)`;

            if (progress < 1) {
                window.requestAnimationFrame(tick);
                return;
            }

            if (heroVideo) {
                heroVideo.currentTime = 0;

                heroVideo.play().catch(() => {});
            }

            if (mobileHeroVideo) {
                mobileHeroVideo.currentTime = 0;
                mobileHeroVideo.play().catch(() => {});
            }

            loadingOverlay.classList.add("is-hidden");
            document.body.classList.add("page-ready");
        };

        loadingCounter.textContent = "(0%)";
        window.requestAnimationFrame(tick);
    }

    if (customCursor && window.matchMedia("(min-width: 901px)").matches) {
        let currentX = window.innerWidth / 2;
        let currentY = window.innerHeight / 2;
        let targetX = currentX;
        let targetY = currentY;

        const renderCursor = () => {
            currentX += (targetX - currentX) * 0.22;
            currentY += (targetY - currentY) * 0.22;
            customCursor.style.transform = `translate(${currentX - 50}px, ${currentY - 50}px)`;
            window.requestAnimationFrame(renderCursor);
        };

        window.addEventListener("mousemove", (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
            document.body.classList.add("cursor-active");
        });

        window.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-active");
        });

        window.requestAnimationFrame(renderCursor);
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomepage);
} else {
    initHomepage();
}
