import { SignIn } from '@dropins/storefront-auth/containers/SignIn.js';
import { render as authRenderer } from '@dropins/storefront-auth/render.js';
import {
  CUSTOMER_ACCOUNT_PATH,
  CUSTOMER_CREATE_ACCOUNT_PATH,
  CUSTOMER_FORGOTPASSWORD_PATH,
  checkIsAuthenticated,
  rootLink,
} from '../../scripts/commerce.js';

// Initialize
import '../../scripts/initializers/auth.js';

/**
 * Decorates the commerce-login block.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  if (checkIsAuthenticated()) {
    window.location.href = rootLink(CUSTOMER_ACCOUNT_PATH);
    return;
  }

  // Clear existing contents
  block.textContent = '';

  // Main Title
  const title = document.createElement('h1');
  title.className = 'commerce-login-main-title';
  title.textContent = 'CUSTOMER LOGIN';

  // Grid Layout Container
  const grid = document.createElement('div');
  grid.className = 'commerce-login-grid';

  // Left Column: Registered Customers
  const registeredCol = document.createElement('div');
  registeredCol.className = 'commerce-login-column registered-column';

  const registeredTitle = document.createElement('h2');
  registeredTitle.className = 'commerce-login-section-title';
  registeredTitle.textContent = 'Registered Customers';

  const registeredSubtitle = document.createElement('p');
  registeredSubtitle.className = 'commerce-login-section-subtitle';
  registeredSubtitle.textContent = 'If you have an account, sign in with your email address.';

  const formWrapper = document.createElement('div');
  formWrapper.className = 'commerce-login-form-wrapper';

  const requiredFields = document.createElement('p');
  requiredFields.className = 'commerce-login-required-fields';
  requiredFields.textContent = '* Required Fields';

  registeredCol.append(registeredTitle, registeredSubtitle, formWrapper, requiredFields);

  // Right Column: New Customers
  const newCol = document.createElement('div');
  newCol.className = 'commerce-login-column new-customers-column';

  const newTitle = document.createElement('h2');
  newTitle.className = 'commerce-login-section-title';
  newTitle.textContent = 'New Customers';

  const newSubtitle = document.createElement('p');
  newSubtitle.className = 'commerce-login-section-subtitle';
  newSubtitle.textContent = 'By creating an account on our website, you will be able to shop faster, be up to date on an orders status, and keep track of the orders you have previously made.';

  const registerBtnWrapper = document.createElement('div');
  registerBtnWrapper.className = 'commerce-login-register-wrapper';

  const registerBtn = document.createElement('a');
  registerBtn.className = 'commerce-login-register-btn';
  registerBtn.href = rootLink(CUSTOMER_CREATE_ACCOUNT_PATH);
  registerBtn.textContent = 'REGISTER';

  registerBtnWrapper.append(registerBtn);
  newCol.append(newTitle, newSubtitle, registerBtnWrapper);

  grid.append(registeredCol, newCol);
  block.append(title, grid);

  // Render Auth Dropin SignIn form inside formWrapper
  await authRenderer.render(SignIn, {
    renderSignUpLink: false,
    routeForgotPassword: () => rootLink(CUSTOMER_FORGOTPASSWORD_PATH),
    routeRedirectOnSignIn: () => rootLink(CUSTOMER_ACCOUNT_PATH),
  })(formWrapper);
}
