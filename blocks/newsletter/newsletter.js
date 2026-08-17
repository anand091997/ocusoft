import { CORE_FETCH_GRAPHQL } from '../../scripts/commerce.js';

const SUBSCRIBE_MUTATION = `
  mutation subscribeEmailToNewsletter($email: String!) {
    subscribeEmailToNewsletter(email: $email) {
      status
    }
  }
`;

/**
 * Validates an email address format
 * @param {string} email
 * @returns {{ valid: boolean, error?: string }}
 */
function validateEmail(email) {
  if (!email) {
    return { valid: false, error: 'Email address is required.' };
  }
  // Standard RFC 5322 pattern check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. name@example.com).' };
  }
  return { valid: true };
}

/**
 * Loads and decorates the newsletter block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // Preserve initial authored content (titles, text) if present
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'newsletter-content';

  const titleTextWrapper = document.createElement('div');
  titleTextWrapper.className = 'newsletter-text';

  Array.from(block.children).forEach((row) => {
    Array.from(row.children).forEach((cell) => {
      if (cell.children.length > 0 || cell.textContent.trim()) {
        titleTextWrapper.appendChild(cell.cloneNode(true));
      }
    });
  });

  if (titleTextWrapper.childNodes.length > 0) {
    contentWrapper.appendChild(titleTextWrapper);
  }

  // Create Newsletter Form
  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.noValidate = true;

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'newsletter-input-wrapper';

  const input = document.createElement('input');
  input.type = 'email';
  input.className = 'newsletter-input';
  input.name = 'email';
  input.placeholder = 'Your Email Address';
  input.setAttribute('aria-label', 'Your Email Address');
  input.setAttribute('aria-invalid', 'false');
  input.required = true;

  inputWrapper.appendChild(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'newsletter-button';
  button.textContent = 'SUBSCRIBE';

  const messageEl = document.createElement('div');
  messageEl.className = 'newsletter-message';
  messageEl.setAttribute('aria-live', 'polite');

  const uniqueId = `newsletter-msg-${Math.random().toString(36).substring(2, 9)}`;
  messageEl.id = uniqueId;
  input.setAttribute('aria-describedby', uniqueId);

  form.appendChild(inputWrapper);
  form.appendChild(button);

  contentWrapper.appendChild(form);
  contentWrapper.appendChild(messageEl);

  block.textContent = '';
  block.appendChild(contentWrapper);

  // Helper functions for error display
  const setError = (errorMsg) => {
    messageEl.textContent = errorMsg;
    messageEl.className = 'newsletter-message newsletter-message-error';
    input.classList.add('newsletter-input-error');
    input.setAttribute('aria-invalid', 'true');
  };

  const clearError = () => {
    messageEl.textContent = '';
    messageEl.className = 'newsletter-message';
    input.classList.remove('newsletter-input-error');
    input.setAttribute('aria-invalid', 'false');
  };

  // Real-time input listener: clear error as user types
  input.addEventListener('input', () => {
    if (input.classList.contains('newsletter-input-error')) {
      clearError();
    }
  });

  // On blur listener: validate if field has content
  input.addEventListener('blur', () => {
    const value = input.value.trim();
    if (value) {
      const result = validateEmail(value);
      if (!result.valid) {
        setError(result.error);
      }
    }
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const email = input.value.trim();
    const validation = validateEmail(email);

    if (!validation.valid) {
      setError(validation.error);
      input.focus();
      return;
    }

    button.disabled = true;
    button.classList.add('loading');

    try {
      const response = await CORE_FETCH_GRAPHQL.fetchGraphQl(SUBSCRIBE_MUTATION, {
        variables: { email },
      });

      if (response?.errors && response.errors.length > 0) {
        setError(response.errors[0].message || 'Failed to subscribe. Please try again.');
      } else {
        const status = response?.data?.subscribeEmailToNewsletter?.status;
        if (status === 'UNCONFIRMED') {
          messageEl.textContent = 'Confirmation email sent. Please check your inbox!';
        } else {
          messageEl.textContent = 'Thank you for subscribing!';
        }
        messageEl.className = 'newsletter-message newsletter-message-success';
        form.reset();
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      button.disabled = false;
      button.classList.remove('loading');
    }
  });
}
