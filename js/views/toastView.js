/**
 * Global Non-Intrusive Toast Notification System (v8.8)
 * Adapts automatically to all 10 Visual Worlds via theme CSS custom properties.
 */

const MAX_TOASTS = 3;

export function showToast(message, tone = 'info', durationMs = 2400) {
  if (typeof document === 'undefined' || !message) return;
  const root = document.getElementById('toastContainer');
  if (!root) return;

  while (root.children.length >= MAX_TOASTS) {
    root.firstElementChild?.remove();
  }

  const el = document.createElement('div');
  el.className = `sa-toast is-${tone}`;
  el.setAttribute('role', 'status');

  const icon = tone === 'success' ? '✔' : (tone === 'warn' ? '⚠' : '✦');
  el.innerHTML = `<span class="sa-toast-icon" aria-hidden="true">${icon}</span><span class="sa-toast-msg"></span>`;
  el.querySelector('.sa-toast-msg').textContent = String(message);

  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));

  const dismiss = () => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 220);
  };

  const timer = setTimeout(dismiss, Math.max(1200, durationMs));
  el.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  });
}
