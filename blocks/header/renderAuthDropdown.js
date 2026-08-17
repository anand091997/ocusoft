import { getCookie } from '@dropins/tools/lib.js';
import * as authApi from '@dropins/storefront-auth/api.js';
import {
  CUSTOMER_LOGIN_PATH,
  rootLink,
} from '../../scripts/commerce.js';

function handleLogout(redirections) {
  const shouldRedirect = Object.entries(redirections).some(([currentPath, redirectPath]) => {
    if (window.location.pathname.includes(currentPath)) {
      window.location.href = redirectPath;
      return true;
    }
    return false;
  });

  if (!shouldRedirect) {
    window.location.reload();
  }
}

export function renderAuthDropdown(navTools) {
  // Shell markup containing only the panel wrapper
  const dropdownElement = document.createRange().createContextualFragment(`
  <div class="dropdown-wrapper nav-tools-wrapper">
    <button type="button" class="nav-dropdown-button" aria-haspopup="dialog" aria-expanded="false" aria-controls="login-modal"></button>
    <div class="nav-auth-menu-panel nav-tools-panel"></div>
  </div>`);

  navTools.append(dropdownElement);

  const authDropDownPanel = navTools.querySelector('.nav-auth-menu-panel');
  const loginButton = navTools.querySelector('.nav-dropdown-button');

  authDropDownPanel.addEventListener('click', (e) => e.stopPropagation());

  async function toggleDropDownAuthMenu(state) {
    const show = state ?? !authDropDownPanel.classList.contains('nav-tools-panel--show');

    authDropDownPanel.classList.toggle('nav-tools-panel--show', show);
    authDropDownPanel.setAttribute('role', 'dialog');
    authDropDownPanel.setAttribute('aria-hidden', 'false');
    authDropDownPanel.setAttribute('aria-labelledby', 'modal-title');
    authDropDownPanel.setAttribute('aria-describedby', 'modal-description');
    authDropDownPanel.focus();
  }

  loginButton.addEventListener('click', () => {
    const getUserTokenCookie = getCookie('auth_dropin_user_token');
    const isUserLoggedIn = Boolean(getUserTokenCookie || authApi.isAuthenticated?.());

    if (isUserLoggedIn) {
      toggleDropDownAuthMenu();
    } else {
      window.location.href = rootLink(CUSTOMER_LOGIN_PATH);
    }
  });

  document.addEventListener('click', async (e) => {
    const clickOnDropDownPanel = authDropDownPanel.contains(e.target);
    const clickOnLoginButton = loginButton.contains(e.target);

    if (!clickOnDropDownPanel && !clickOnLoginButton) {
      await toggleDropDownAuthMenu(false);
    }
  });

  const updateDropDownUI = (isAuthenticated) => {
    const getUserTokenCookie = getCookie('auth_dropin_user_token');
    const getUserNameCookie = getCookie('auth_dropin_firstname') || '';

    const isUserLoggedIn = typeof isAuthenticated === 'boolean'
      ? isAuthenticated
      : Boolean(getUserTokenCookie || authApi.isAuthenticated?.());

    if (isUserLoggedIn) {
      // 1. Update trigger button
      loginButton.innerHTML = `<span class="icon-user"></span><span class="user-name-text">Hi, ${getUserNameCookie}</span>`;

      // 2. Render authenticated menu inside panel
      authDropDownPanel.innerHTML = `
        <div class="user-auth-container login-user-auth-container">
        <ul class="authenticated-user-menu">
          <li class="user-heading">
            <div class="left-circle">
             <span class="cust-short-name">${getUserNameCookie.charAt(0)}</span>
            </div>
            <div class="welcome-info">
              <span>Welcome back!</span>
              <span class="cust-name">${getUserNameCookie}</span>
            </div>
          </li>
          <li><a href="${rootLink('/customer/account')}">My Account</a></li>
          <li><a href="${rootLink('/customer/orders')}">My Orders</a></li>
          <li><button class="logout-button">Logout</button></li>
        </ul> 
        </div>`;

      // Attach logout handler to newly rendered button
      const logoutButton = authDropDownPanel.querySelector('.logout-button');
      logoutButton?.addEventListener('click', async () => {
        await authApi.revokeCustomerToken();
        handleLogout({
          '/checkout': rootLink('/cart'),
          '/customer': rootLink('/customer/login'),
          '/order-details': rootLink('/'),
        });
      });
    } else {
      // 1. Update trigger button
      loginButton.innerHTML = '<span class="icon-user"></span><span class="sign-in">Sign In</span>';

      // 2. Clear panel content when not logged in
      authDropDownPanel.innerHTML = '';
    }
  };

  // Initial render
  updateDropDownUI();

  // Handle real-time state changes
  authApi.events?.on('authenticated', (isAuthenticated) => {
    updateDropDownUI(isAuthenticated);
  });
}
