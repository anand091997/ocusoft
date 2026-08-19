import { UpdatePassword } from '@dropins/storefront-auth/containers/UpdatePassword.js';
import { render as authRenderer } from '@dropins/storefront-auth/render.js';
import { SuccessNotification } from '@dropins/storefront-auth/containers/SuccessNotification.js';
import { Button, provider as UI } from '@dropins/tools/components.js';
import * as authApi from '@dropins/storefront-auth/api.js';
import {
  CUSTOMER_ACCOUNT_PATH,
  CUSTOMER_LOGIN_PATH,
  checkIsAuthenticated,
  rootLink,
} from '../../scripts/commerce.js';

// Initialize
import '../../scripts/initializers/auth.js';

/**
 * Decorates the commerce-create-password block.
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
  title.className = 'commerce-create-password-main-title';
  title.textContent = 'CREATE NEW PASSWORD';

  // Section Container
  const content = document.createElement('div');
  content.className = 'commerce-create-password-content';

  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'commerce-create-password-section-title';
  sectionTitle.textContent = 'Set a New Password';

  const sectionSubtitle = document.createElement('p');
  sectionSubtitle.className = 'commerce-create-password-section-subtitle';
  sectionSubtitle.textContent = 'Please enter your new password below.';

  const formWrapper = document.createElement('div');
  formWrapper.className = 'commerce-create-password-form-wrapper';

  content.append(sectionTitle, sectionSubtitle, formWrapper);
  block.append(title, content);

  await authRenderer.render(UpdatePassword, {
    routeWrongUrlRedirect: () => rootLink(CUSTOMER_LOGIN_PATH),
    routeSignInPage: () => rootLink(CUSTOMER_LOGIN_PATH),
    slots: {
      SuccessNotification: (ctx) => {
        const userName = ctx?.isSuccessful?.userName || '';

        const elem = document.createElement('div');

        authRenderer.render(SuccessNotification, {
          labels: {
            headingText: `Welcome ${userName}!`,
            messageText: 'Your password has been successfully updated.',
          },
          slots: {
            SuccessNotificationActions: (innerCtx) => {
              const primaryBtn = document.createElement('div');

              UI.render(Button, {
                children: 'My Account',

                onClick: () => {
                  window.location.href = rootLink(CUSTOMER_ACCOUNT_PATH);
                },
              })(primaryBtn);

              innerCtx.appendChild(primaryBtn);

              const secondaryButton = document.createElement('div');
              secondaryButton.style.display = 'flex';
              secondaryButton.style.justifyContent = 'center';
              secondaryButton.style.marginTop = 'var(--spacing-xsmall)';

              UI.render(Button, {
                children: 'Logout',
                variant: 'tertiary',
                onClick: async () => {
                  await authApi.revokeCustomerToken();
                  window.location.href = rootLink('/');
                },
              })(secondaryButton);

              innerCtx.appendChild(secondaryButton);
            },
          },
        })(elem);

        ctx.appendChild(elem);
      },
    },
  })(formWrapper);

  const customizeFormContent = () => {
    const passwordInput = formWrapper.querySelector('input[name="password"], input[type="password"], input[type="text"]');
    if (passwordInput && passwordInput.placeholder !== 'Enter New Password') {
      passwordInput.placeholder = 'Enter New Password';
    }

    const passwordLabel = formWrapper.querySelector('.dropin-input__label--floating, .dropin-input__label, label');
    if (passwordLabel && passwordLabel.textContent !== 'New Password*') {
      passwordLabel.textContent = 'New Password*';
    }

    const submitButton = formWrapper.querySelector('button[type="submit"]');
    if (submitButton) {
      const span = submitButton.querySelector('span');
      if (span && span.textContent !== 'SET NEW PASSWORD') {
        span.textContent = 'SET NEW PASSWORD';
      } else if (!span && submitButton.textContent !== 'SET NEW PASSWORD') {
        submitButton.textContent = 'SET NEW PASSWORD';
      }
    }
  };

  customizeFormContent();
  const observer = new MutationObserver(() => customizeFormContent());
  observer.observe(formWrapper, { childList: true, subtree: true, characterData: true });
}
