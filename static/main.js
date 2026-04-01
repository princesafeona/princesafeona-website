const initHomepage = () => {
    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingCounter = document.getElementById("loading-counter");
    const heroVideo = document.getElementById("hero-video");
    const soundToggle = document.getElementById("sound-toggle");

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

    if (loadingOverlay && loadingCounter) {
        const duration = 3000;
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

            loadingOverlay.classList.add("is-hidden");
        };

        loadingCounter.textContent = "(0%)";
        window.requestAnimationFrame(tick);
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomepage);
} else {
    initHomepage();
}
