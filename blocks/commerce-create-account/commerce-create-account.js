import { SignUp } from '@dropins/storefront-auth/containers/SignUp.js';
import { render as authRenderer } from '@dropins/storefront-auth/render.js';
import {
  CUSTOMER_ACCOUNT_PATH,
  CUSTOMER_LOGIN_PATH,
  checkIsAuthenticated,
  authPrivacyPolicyConsentSlot,
  rootLink,
} from '../../scripts/commerce.js';

// Initialize
import '../../scripts/initializers/auth.js';

/**
 * Decorates the commerce-create-account block.
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
  title.className = 'commerce-create-account-main-title';
  title.textContent = 'REGISTER';

  // Section Container
  const content = document.createElement('div');
  content.className = 'commerce-create-account-content';

  const formWrapper = document.createElement('div');
  formWrapper.className = 'commerce-create-account-form-wrapper';

  const requiredFields = document.createElement('p');
  requiredFields.className = 'commerce-create-account-required-fields';
  requiredFields.textContent = '* Required Fields';

  content.append(formWrapper, requiredFields);
  block.append(title, content);

  await authRenderer.render(SignUp, {
    hideCloseBtnOnEmailConfirmation: true,
    routeSignIn: () => rootLink(CUSTOMER_LOGIN_PATH),
    routeRedirectOnSignIn: () => rootLink(CUSTOMER_ACCOUNT_PATH),
    slots: {
      ...authPrivacyPolicyConsentSlot,
    },
  })(formWrapper);

  const customizeFormContent = () => {
    const submitButton = formWrapper.querySelector('button[type="submit"]');
    if (submitButton) {
      const span = submitButton.querySelector('span');
      if (span && span.textContent !== 'CREATE AN ACCOUNT') {
        span.textContent = 'CREATE AN ACCOUNT';
      } else if (!span && submitButton.textContent !== 'CREATE AN ACCOUNT') {
        submitButton.textContent = 'CREATE AN ACCOUNT';
      }
    }
  };

  customizeFormContent();
  const observer = new MutationObserver(() => customizeFormContent());
  observer.observe(formWrapper, { childList: true, subtree: true, characterData: true });
}
