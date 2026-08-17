import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the topbar block
 * @param {Element} block The topbar block element
 */
export default async function decorate(block) {
  const topbarMeta = getMetadata('topbar');
  const topbarPath = topbarMeta ? new URL(topbarMeta, window.location).pathname : '/topbar';

  if (topbarMeta === 'none') {
    block.closest('.topbar-wrapper')?.remove();
    return;
  }

  const fragment = await loadFragment(topbarPath);

  block.textContent = '';
  if (fragment) {
    const topbarContent = document.createElement('div');
    topbarContent.className = 'topbar-content';
    while (fragment.firstElementChild) topbarContent.append(fragment.firstElementChild);
    block.append(topbarContent);
  } else {
    block.closest('.topbar-wrapper')?.remove();
  }
}
