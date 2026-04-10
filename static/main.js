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
    const mobileSoundToggle = document.getElementById("mobile-sound-toggle");
    const mobileTimeCounter = document.getElementById("mobile-time-counter");
    const mobileMenuTrigger = document.getElementById("mobile-menu-trigger");
    const mobileOverlayRoot = document.getElementById("mobile-overlay-root");
    const mobileMenuTemplate = document.getElementById("mobile-menu-template");
    const mobileAboutTemplate = document.getElementById("mobile-about-template");
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const setVideoSource = (video) => {
        if (!video || video.src || !video.dataset.src) {
            return;
        }

        video.src = video.dataset.src;
    };

    if (heroVideo) {
        heroVideo.muted = true;
    }

    if (mobileHeroVideo) {
        mobileHeroVideo.muted = true;
    }

    if (desktopQuery.matches) {
        setVideoSource(heroVideo);
    }

    if (mobileQuery.matches) {
        setVideoSource(mobileHeroVideo);
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

    if (mobileSoundToggle && mobileHeroVideo && mobileQuery.matches) {
        const formatMobileTime = (remainingSeconds) => {
            const clamped = Math.max(0, remainingSeconds);
            const totalMinutes = Math.floor(clamped / 60);
            const seconds = Math.floor(clamped % 60);
            const hundredths = Math.floor((clamped % 1) * 100);

            return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(hundredths).padStart(2, "0")}`;
        };

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

        const updateMobileTime = () => {
            if (mobileTimeCounter) {
                const duration = Number.isFinite(mobileHeroVideo.duration) ? mobileHeroVideo.duration : 0;
                const currentTime = mobileHeroVideo.currentTime || 0;
                mobileTimeCounter.textContent = formatMobileTime(Math.max(0, duration - currentTime));
            }
        };

        updateMobileSound();
        updateMobileTime();

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

        mobileHeroVideo.addEventListener("timeupdate", updateMobileTime);
        mobileHeroVideo.addEventListener("loadedmetadata", updateMobileTime);
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

    if (mobileMenuTrigger && mobileOverlayRoot && mobileMenuTemplate && mobileAboutTemplate && mobileHeroVideo) {
        const mobileVideoHomeParent = mobileHeroVideo.parentElement;
        let activeMobileOverlay = null;
        let lastMobileOverlay = "menu";

        const clearMobileOverlay = () => {
            if (activeMobileOverlay) {
                activeMobileOverlay.remove();
                activeMobileOverlay = null;
            }
        };

        const restoreMobileVideoHome = () => {
            if (mobileHeroVideo.parentElement !== mobileVideoHomeParent) {
                mobileHeroVideo.classList.remove("is-about-background");
                mobileVideoHomeParent.insertBefore(mobileHeroVideo, mobileVideoHomeParent.firstChild);
            }
        };

        const mountMobileOverlay = (template) => {
            clearMobileOverlay();
            const fragment = template.content.cloneNode(true);
            const element = fragment.firstElementChild;
            mobileOverlayRoot.appendChild(fragment);
            activeMobileOverlay = mobileOverlayRoot.lastElementChild || element;
            return activeMobileOverlay;
        };

        const openMobileMenu = () => {
            if (!mobileQuery.matches) {
                return;
            }

            restoreMobileVideoHome();
            lastMobileOverlay = "menu";
            const menuScreen = mountMobileOverlay(mobileMenuTemplate);
            const menuClose = menuScreen.querySelector("#mobile-menu-close");
            const aboutTrigger = menuScreen.querySelector("#mobile-about-trigger");

            if (menuClose) {
                menuClose.addEventListener("click", () => {
                    clearMobileOverlay();
                });
            }

            if (aboutTrigger) {
                aboutTrigger.addEventListener("click", openMobileAbout);
            }
        };

        const openMobileAbout = () => {
            if (!mobileQuery.matches) {
                return;
            }

            lastMobileOverlay = "about";
            const aboutScreen = mountMobileOverlay(mobileAboutTemplate);
            const aboutCloseButton = aboutScreen.querySelector("#mobile-about-close");
            const aboutMedia = aboutScreen.querySelector(".mobile-about-media");

            if (aboutMedia) {
                mobileHeroVideo.classList.add("is-about-background");
                aboutMedia.insertBefore(mobileHeroVideo, aboutMedia.firstChild);
            }

            if (aboutCloseButton) {
                aboutCloseButton.addEventListener("click", () => {
                    restoreMobileVideoHome();
                    openMobileMenu();
                });
            }
        };

        mobileMenuTrigger.addEventListener("click", openMobileMenu);

        const handleViewportChange = () => {
            if (desktopQuery.matches) {
                setVideoSource(heroVideo);
            }

            if (mobileQuery.matches) {
                setVideoSource(mobileHeroVideo);
            }

            if (desktopQuery.matches) {
                clearMobileOverlay();
                restoreMobileVideoHome();
            }
        };

        if (typeof desktopQuery.addEventListener === "function") {
            desktopQuery.addEventListener("change", handleViewportChange);
        } else if (typeof desktopQuery.addListener === "function") {
            desktopQuery.addListener(handleViewportChange);
        }
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

            if (desktopQuery.matches && heroVideo) {
                heroVideo.currentTime = 0;

                heroVideo.play().catch(() => {});
            }

            if (mobileQuery.matches && mobileHeroVideo) {
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
