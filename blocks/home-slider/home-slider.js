import { loadCSS } from '../../scripts/aem.js';
import { Splide } from './vendor/splide.esm.js';

/**
 * Decorates the home slider block using Splide.js
 * @param {Element} block The home slider block element
 */
export default async function decorate(block) {
  // Load Splide CSS locally
  loadCSS(`${window.hlx.codeBasePath}/blocks/home-slider/vendor/splide.min.css`);

  const rows = [...block.children];
  if (!rows.length) return;

  const splideTrack = document.createElement('div');
  splideTrack.classList.add('splide__track');

  const splideList = document.createElement('ul');
  splideList.classList.add('splide__list');

  rows.forEach((row) => {
    const cols = [...row.children];
    if (!cols.length) return;

    const slide = document.createElement('li');
    slide.classList.add('splide__slide', 'home-slider-slide');

    let desktopCol = null;
    let mobileCol = null;
    let contentCol = null;

    if (cols.length >= 3) {
      [desktopCol, mobileCol, contentCol] = cols;
    } else if (cols.length === 2) {
      [desktopCol, contentCol] = cols;
    } else {
      [desktopCol] = cols;
    }

    const mediaWrapper = document.createElement('div');
    mediaWrapper.classList.add('home-slider-media');

    if (desktopCol) {
      const desktopPic = desktopCol.querySelector('picture, img');
      if (desktopPic) {
        desktopPic.classList.add('home-slider-desktop-img');
        if (!mobileCol) {
          desktopPic.classList.add('home-slider-single-img');
        }
        mediaWrapper.append(desktopPic);
      }
    }

    if (mobileCol) {
      const mobilePic = mobileCol.querySelector('picture, img');
      if (mobilePic) {
        mobilePic.classList.add('home-slider-mobile-img');
        mediaWrapper.append(mobilePic);
      }
    }

    if (mediaWrapper.children.length > 0) {
      slide.append(mediaWrapper);
    }

    if (contentCol) {
      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('home-slider-content');
      contentWrapper.innerHTML = contentCol.innerHTML;

      // Style CTA links inside slide content
      contentWrapper.querySelectorAll('a').forEach((link) => {
        link.classList.add('button', 'primary', 'home-slider-cta');
      });

      slide.append(contentWrapper);
    }

    splideList.append(slide);
  });

  splideTrack.append(splideList);
  block.replaceChildren(splideTrack);
  block.classList.add('splide');

  // Initialize Splide slider
  const splide = new Splide(block, {
    type: 'slide',
    autoplay: true,
    interval: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    arrows: false,
    pagination: true,
    speed: 800,
  });

  splide.mount();
}
