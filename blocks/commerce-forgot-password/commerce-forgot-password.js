import { ResetPassword } from '@dropins/storefront-auth/containers/ResetPassword.js';
import { render as authRenderer } from '@dropins/storefront-auth/render.js';
import { events } from '@dropins/tools/event-bus.js';
import {
  CUSTOMER_ACCOUNT_PATH,
  CUSTOMER_LOGIN_PATH,
  checkIsAuthenticated,
  rootLink,
} from '../../scripts/commerce.js';

// Initialize
import '../../scripts/initializers/auth.js';

/**
 * Decorates the commerce-forgot-password block.
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
  title.className = 'commerce-forgot-password-main-title';
  title.textContent = 'FORGOT PASSWORD';

  // Section Container
  const content = document.createElement('div');
  content.className = 'commerce-forgot-password-content';

  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'commerce-forgot-password-section-title';
  sectionTitle.textContent = 'Password Recovery';

  const sectionSubtitle = document.createElement('p');
  sectionSubtitle.className = 'commerce-forgot-password-section-subtitle';
  sectionSubtitle.textContent = 'Please enter your email address below. You will receive a link to reset your password.';

  const formWrapper = document.createElement('div');
  formWrapper.className = 'commerce-forgot-password-form-wrapper';

  content.append(sectionTitle, sectionSubtitle, formWrapper);
  block.append(title, content);

  // Render Auth Dropin ResetPassword form inside formWrapper
  await authRenderer.render(ResetPassword, {
    routeSignIn: () => rootLink(CUSTOMER_LOGIN_PATH),
  })(formWrapper);

  const customizeFormContent = () => {
    const emailInput = formWrapper.querySelector('input[name="email"], input[type="email"], input[type="text"]');
    if (emailInput && emailInput.placeholder !== 'Enter Email') {
      emailInput.placeholder = 'Enter Email';
    }

    const emailLabel = formWrapper.querySelector('.dropin-input__label--floating, .dropin-input__label, label');
    if (emailLabel && emailLabel.textContent !== 'Your Email Address*') {
      emailLabel.textContent = 'Your Email Address*';
    }

    const submitButton = formWrapper.querySelector('button[type="submit"]');
    if (submitButton) {
      const span = submitButton.querySelector('span');
      if (span && span.textContent !== 'RESET MY PASSWORD') {
        span.textContent = 'RESET MY PASSWORD';
      } else if (!span && submitButton.textContent !== 'RESET MY PASSWORD') {
        submitButton.textContent = 'RESET MY PASSWORD';
      }
    }
  };

  customizeFormContent();
  const observer = new MutationObserver(() => customizeFormContent());
  observer.observe(formWrapper, { childList: true, subtree: true, characterData: true });

  events.on('authenticated', (authenticated) => {
    if (authenticated) window.location.href = rootLink(CUSTOMER_ACCOUNT_PATH);
  });
}
