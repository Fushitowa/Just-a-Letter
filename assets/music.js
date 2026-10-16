(() => {
  const audio = document.querySelector('#background-song');
  const control = document.querySelector('.music-control');
  const label = control?.querySelector('.music-label');

  if (!audio || !control || !label) return;

  const positionKey = 'love-letter-song-position';
  audio.volume = 0.38;

  try {
    const savedPosition = Number(sessionStorage.getItem(positionKey));
    if (Number.isFinite(savedPosition) && savedPosition > 0) {
      audio.addEventListener('loadedmetadata', () => {
        if (savedPosition < audio.duration) audio.currentTime = savedPosition;
      }, { once: true });
    }
  } catch {
    // Playback still works if session storage is unavailable.
  }

  function syncControl() {
    const isPlaying = !audio.paused;
    control.setAttribute('aria-pressed', String(isPlaying));
    control.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
    label.textContent = isPlaying ? 'Pause music' : 'Play music';
    control.classList.toggle('is-playing', isPlaying);
  }

  audio.addEventListener('play', syncControl);
  audio.addEventListener('pause', syncControl);
  audio.addEventListener('timeupdate', () => {
    try {
      sessionStorage.setItem(positionKey, String(audio.currentTime));
    } catch {
      // Ignore storage restrictions and keep playback uninterrupted.
    }
  });
  window.addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem(positionKey, String(audio.currentTime));
    } catch {
      // Ignore storage restrictions and keep playback uninterrupted.
    }
  });

  control.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        syncControl();
      }
    } else {
      audio.pause();
    }
  });

  audio.play().then(syncControl).catch(syncControl);
})();
