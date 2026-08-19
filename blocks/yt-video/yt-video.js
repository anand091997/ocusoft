/**
 * Extracts YouTube video ID from various YouTube URL formats.
 * @param {string} url
 * @returns {string|null}
 */
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Creates and opens the video modal dialog.
 * @param {string} videoId
 * @param {string} title
 */
function openVideoModal(videoId, title) {
  if (document.querySelector('.yt-video-modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'yt-video-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', title || 'Video player');

  overlay.innerHTML = `
    <div class="yt-video-modal-dialog">
      <div class="yt-video-modal-header">
        <h3 class="yt-video-modal-title">${title || ''}</h3>
        <button type="button" class="yt-video-modal-close" aria-label="Close modal">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 1L1 11M1 1L11 11" stroke="#333" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="yt-video-modal-divider"></div>
      <div class="yt-video-modal-body">
        <iframe
          src="https://www.youtube.com/embed/${videoId}?rel=0"
          title="${title || 'YouTube video player'}"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </div>
  `;

  const closeModal = () => {
    overlay.classList.add('yt-video-modal-closing');
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 200);
  };

  overlay.querySelector('.yt-video-modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

/**
 * Decorates the yt-video block.
 * @param {Element} block
 */
export default async function decorate(block) {
  const rows = [...block.children];
  let posterPicture = null;
  let videoTitle = '';
  let videoUrl = '';

  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        posterPicture = pic;
      }
      const anchor = col.querySelector('a');
      if (anchor) {
        videoUrl = anchor.href;
      }

      // Clone column without picture and anchor to accurately extract authored title text
      const colClone = col.cloneNode(true);
      colClone.querySelectorAll('picture, a').forEach((el) => el.remove());
      const textContent = colClone.textContent.trim();
      if (textContent && !videoTitle) {
        videoTitle = textContent;
      }
    });
  });

  if (!videoUrl) {
    const linkMatch = block.textContent.match(/https?:\/\/[^\s]+/);
    if (linkMatch) [videoUrl] = linkMatch;
  }

  const videoId = getYouTubeId(videoUrl);

  block.textContent = '';

  const posterWrapper = document.createElement('div');
  posterWrapper.className = 'yt-video-poster-wrapper';
  posterWrapper.setAttribute('role', 'button');
  posterWrapper.setAttribute('tabindex', '0');
  posterWrapper.setAttribute('aria-label', `Play video: ${videoTitle || 'OCuSOFT Video'}`);

  if (posterPicture) {
    posterWrapper.appendChild(posterPicture);
  }

  const overlayContent = document.createElement('div');
  overlayContent.className = 'yt-video-overlay-content';

  const playBtn = document.createElement('div');
  playBtn.className = 'yt-video-play-btn';
  playBtn.innerHTML = `
    <div class="yt-video-play-ring">
      <div class="yt-video-play-circle">
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.5 12.4019C23.8333 13.1717 23.8333 15.0963 22.5 15.866L3.75 26.6913C2.41667 27.4611 0.750001 26.4989 0.750001 24.9593L0.750002 3.30867C0.750002 1.76907 2.41667 0.80682 3.75 1.57662L22.5 12.4019Z" fill="#1a428a"/>
        </svg>
      </div>
    </div>
  `;

  overlayContent.appendChild(playBtn);

  if (videoTitle) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'yt-video-title';
    titleEl.textContent = videoTitle;
    overlayContent.appendChild(titleEl);
  }

  posterWrapper.appendChild(overlayContent);
  block.appendChild(posterWrapper);

  const handlePlayClick = () => {
    if (videoId) {
      openVideoModal(videoId, videoTitle);
    }
  };

  posterWrapper.addEventListener('click', handlePlayClick);
  posterWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlayClick();
    }
  });
}
