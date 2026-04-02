const initHomepage = () => {
    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingCounter = document.getElementById("loading-counter");
    const heroVideo = document.getElementById("hero-video");
    const soundToggle = document.getElementById("sound-toggle");
    const aboutTrigger = document.getElementById("about-trigger");
    const aboutLayer = document.getElementById("about-layer");
    const aboutClose = document.getElementById("about-close");
    const customCursor = document.getElementById("custom-cursor");

    if (heroVideo) {
        heroVideo.muted = true;
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

    if (aboutTrigger && aboutLayer && aboutClose) {
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

        aboutTrigger.addEventListener("click", openAbout);
        aboutClose.addEventListener("click", closeAbout);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && aboutLayer.classList.contains("is-visible")) {
                closeAbout();
            }
        });
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
            currentX += (targetX - currentX) * 0.18;
            currentY += (targetY - currentY) * 0.18;
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
