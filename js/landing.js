/**
 * ==============================================================================
 * BHARAT EXPLORE — Cinematic Landing Page Controller (SIH 2026)
 * Pure Vanilla JavaScript Engine
 * Features:
 *   1. Hardware-accelerated 60fps mouse parallax with smooth lerp physics
 *   2. Programmatic 1.25x video playback rate on metadata load
 *   3. Autonomous GSAP entrance choreography with zero-dependency CSS fallback
 *   4. Mobile navigation drawer toggle with ARIA accessibility states
 * ==============================================================================
 */

(function () {
  'use strict';

  function initLandingPage() {
    const heroVideo = document.getElementById('heroVideo');
    const videoContainer = document.getElementById('videoParallaxContainer');
    const heroTypography = document.getElementById('heroTypography');
    const bottomBlock = document.getElementById('bottomBlock');
    const navToggle = document.querySelector('.nav-toggle');
    const navbar = document.getElementById('navbar');

    // --------------------------------------------------------------------------
    // 1. High-Fidelity Video Playback Rate Controller (1.25x)
    // --------------------------------------------------------------------------
    if (heroVideo) {
      const applyPlaybackRate = () => {
        try {
          heroVideo.playbackRate = 1.25;
        } catch (err) {
          console.warn('[Bharat Explore] Unable to set playbackRate:', err);
        }
      };

      if (heroVideo.readyState >= 1) {
        applyPlaybackRate();
      } else {
        heroVideo.addEventListener('loadedmetadata', applyPlaybackRate, { once: true });
      }

      // Autoplay safety fallback: ensure muted video continues looping smoothly
      const startVideo = () => {
        if (heroVideo.paused) {
          heroVideo.play().catch(() => {
            // Autoplay blocked: wait for first interaction
            const resumeOnInteraction = () => {
              heroVideo.play().catch(() => {});
              window.removeEventListener('click', resumeOnInteraction);
              window.removeEventListener('keydown', resumeOnInteraction);
              window.removeEventListener('touchstart', resumeOnInteraction);
            };
            window.addEventListener('click', resumeOnInteraction, { once: true });
            window.addEventListener('keydown', resumeOnInteraction, { once: true });
            window.addEventListener('touchstart', resumeOnInteraction, { once: true });
          });
        }
      };

      startVideo();
    }

    // --------------------------------------------------------------------------
    // 2. GSAP Entrance Orchestration with Native CSS Fallback
    // --------------------------------------------------------------------------
    if (typeof gsap !== 'undefined') {
      if (heroTypography) {
        gsap.to(heroTypography, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out'
        });
      }

      if (bottomBlock) {
        gsap.to(bottomBlock, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.35,
          ease: 'power3.out'
        });
      }
    } else {
      // Pure CSS fallback if GSAP CDN is unreachable or blocked
      if (heroTypography) {
        heroTypography.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        heroTypography.style.opacity = '1';
        heroTypography.style.transform = 'translateY(0)';
      }
      if (bottomBlock) {
        setTimeout(() => {
          bottomBlock.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
          bottomBlock.style.opacity = '1';
          bottomBlock.style.transform = 'translateY(0)';
        }, 350);
      }
    }

    // --------------------------------------------------------------------------
    // 3. 60fps Mouse Parallax Lerp Loop
    // --------------------------------------------------------------------------
    if (videoContainer) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let isTracking = true;

      const onMouseMove = (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        targetX = ((e.clientX - cx) / cx) * 20;
        targetY = ((e.clientY - cy) / cy) * 20;
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const updateParallax = () => {
        if (!isTracking) return;

        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        if (typeof gsap !== 'undefined') {
          gsap.set(videoContainer, {
            x: currentX,
            y: currentY,
            force3D: true
          });
        } else {
          videoContainer.style.transform = `scale(1.08) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        }

        requestAnimationFrame(updateParallax);
      };

      requestAnimationFrame(updateParallax);

      // Clean up when navigating away or hidden
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          isTracking = false;
        } else {
          isTracking = true;
          requestAnimationFrame(updateParallax);
        }
      });
    }

    // --------------------------------------------------------------------------
    // 4. Mobile Navigation Drawer Controller
    // --------------------------------------------------------------------------
    if (navToggle && navbar) {
      navToggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLandingPage);
  } else {
    initLandingPage();
  }
})();
