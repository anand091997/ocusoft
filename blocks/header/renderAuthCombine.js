import { events } from '@dropins/tools/event-bus.js';
import { CUSTOMER_ACCOUNT_PATH, getProductLink, rootLink } from '../../scripts/commerce.js';

function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
}

function onHeaderLinkClick(accountLi) {
  if (window.innerWidth < 1024) {
    const mobileAccountWrapper = accountLi.querySelector('.mobile-nav__panel');

    const authCombineNavElements = document.querySelectorAll(
      '.authCombineNavElement',
    );
    if (authCombineNavElements.length > 1) {
      const elToHide = authCombineNavElements[1];
      if (elToHide) {
        elToHide.style.display = 'none';
      }
    }

    if (mobileAccountWrapper) {
      const activeNavItems = mobileAccountWrapper.querySelectorAll('li');
      activeNavItems.forEach((activeNavItem) => {
        activeNavItem.classList.add('mobileNavGroup');
      });
    }

    const dropdownList = accountLi.querySelector('.submenu');
    if (dropdownList) {
      const dropdownItems = dropdownList.querySelectorAll('li');
      dropdownItems.forEach((dropdownItem) => {
        dropdownItem.classList.add('mobileNavGroup');
      });
    }

    const dynamicButtonMobile = document.createElement('div');

    dynamicButtonMobile.innerHTML = `
      <div id="dynamicButtonMobileContainer" class="dynamicButtonMobileContainer">
        <button id="dynamicButtonMobile" class="dynamicButtonMobile">Sign In</button>
      </div>
    `;

    if (dropdownList) {
      dropdownList.appendChild(dynamicButtonMobile);
    }
    if (mobileAccountWrapper) {
      mobileAccountWrapper.appendChild(dynamicButtonMobile);
    }

    const signInButtonMobile = document.querySelector('#dynamicButtonMobile');

    if (signInButtonMobile) {
      signInButtonMobile.addEventListener('click', async () => {
        const { renderSignInModal } = await import(
          '../../scripts/initializers/auth.js'
        );
        renderSignInModal();

        const signInModal = document.querySelector('.auth-combine-modal');

        if (!signInModal) return;

        signInModal.setAttribute('aria-modal', 'true');
        signInModal.setAttribute('role', 'dialog');

        const viewportMeta = document.querySelector('meta[name="viewport"]');

        if (!viewportMeta) {
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

          document.head.appendChild(meta);
        } else {
          viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }

        const handleModalKeydown = (event) => {
          if (event.key === 'Escape') {
            signInModal.style.display = 'none';

            viewportMeta.content = 'width=device-width, initial-scale=1.0';

            document.removeEventListener('keydown', handleModalKeydown);
          }

          if (event.key === 'Tab') {
            const focusableElements = signInModal.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
              }
            } else if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        };

        document.addEventListener('keydown', handleModalKeydown);
      });
    }
  }

  if (window.innerWidth >= 1024) {
    const desktopAccountWrapper = accountLi.querySelector('.submenu');

    const dynamicButtonDesktop = document.createElement('div');

    dynamicButtonDesktop.innerHTML = `
      <div id="dynamicButtonDesktopContainer" class="dynamicButtonDesktopContainer">
        <button id="dynamicButtonDesktop" class="dynamicButtonDesktop">Sign In</button>
      </div>
    `;

    if (desktopAccountWrapper) {
      desktopAccountWrapper.appendChild(dynamicButtonDesktop);
    }

    const signInButtonDesktop = document.querySelector('#dynamicButtonDesktop');

    if (signInButtonDesktop) {
      signInButtonDesktop.addEventListener('click', async () => {
        const { renderSignInModal } = await import(
          '../../scripts/initializers/auth.js'
        );
        renderSignInModal();
      });
    }
  }
}

/**
 * Decoupled block-friendly variant initialization hook.
 * Target search criteria scale dynamically inside desktop mega-menus or mobile drawers.
 */
const renderAuthCombine = (navSections, toggleMenu) => {
  if (!navSections || typeof navSections.querySelector !== 'function') return;
  if (getCookie('auth_dropin_firstname')) return;

  // Locate pre-compiled tree instances safely across both presentation viewport states
  const desktopList = navSections.querySelector('.nav-top-level-list');
  const mobileList = navSections.querySelector('.mobile-accordion-root');

  const activeLists = [desktopList, mobileList].filter((l) => l && typeof l.querySelectorAll === 'function');

  // Fallback: Check standard block structures if invoked on raw fallback files
  if (activeLists.length === 0) {
    const fallbackList = navSections.querySelector('.default-content-wrapper > ul');
    if (fallbackList && typeof fallbackList.querySelectorAll === 'function') {
      activeLists.push(fallbackList);
    }
  }

  if (activeLists.length === 0) return;

  activeLists.forEach((list) => {
    if (!list || typeof list.querySelectorAll !== 'function') return;
    const listItems = list.querySelectorAll(':scope > li');
    if (!listItems) return;

    const accountLi = Array.from(listItems).find((li) => li?.textContent?.includes('Account'));

    if (accountLi) {
      // Dynamic list target query broken down to adhere to max-len rules
      const authCombineLink = accountLi.querySelector(
        '.submenu > li:last-child, .mobile-nav__panel > li:last-child, ul > li:last-child',
      );
      if (!authCombineLink) return;

      authCombineLink.classList.add('authCombineNavElement');
      const text = authCombineLink.textContent || '';
      authCombineLink.innerHTML = `<a href="#">${text}</a>`;

      authCombineLink.addEventListener('click', (event) => {
        event.preventDefault();
        onHeaderLinkClick(accountLi);

        function getPopupElements() {
          const headerBlock = document.querySelector('.header.block');
          const headerLoginButton = document.querySelector('#header-login-button');
          const popupElement = document.querySelector('#popup-menu');
          const popupMenuContainer = document.querySelector('.popupMenuContainer');
          return {
            headerBlock, headerLoginButton, popupElement, popupMenuContainer,
          };
        }

        events.on('authenticated', (isAuthenticated) => {
          const authCombineNavElement = document.querySelector('.authCombineNavElement');
          if (isAuthenticated) {
            const { headerLoginButton, popupElement, popupMenuContainer } = getPopupElements();

            if (!authCombineNavElement || !headerLoginButton
              || !popupElement || !popupMenuContainer) {
              return;
            }

            authCombineNavElement.style.display = 'none';
            popupMenuContainer.innerHTML = '';
            popupElement.style.minWidth = '250px';
            if (headerLoginButton) {
              const spanElementText = headerLoginButton.querySelector('span');
              if (spanElementText) {
                spanElementText.textContent = `Hi, ${getCookie('auth_dropin_firstname') || ''}`;
              }
            }
            popupMenuContainer.insertAdjacentHTML(
              'afterend',
              `<ul class="popupMenuUrlList">
                <li><a href="${rootLink(CUSTOMER_ACCOUNT_PATH)}">My Account</a></li>
                <li>
                  <a href="${getProductLink('hollister-backyard-sweatshirt', 'MH05')}">Product page</a>
                </li>
                <li><button class="logoutButton">Logout</button></li>
              </ul>`,
            );
          }
        });
        toggleMenu?.();
      });
    }
  });
};

export default renderAuthCombine;
