/**
 * MutationObserver that watches for dynamically added Google Docs
 * UI elements (menus, dialogs, sidebars) and ensures dark mode
 * styles are applied to them.
 *
 * Google Docs lazily loads many UI components — this observer
 * catches those additions and re-applies the theme if needed.
 *
 * Handles `document_start` timing: waits for `document.body`
 * to exist before attaching the observer.
 */

type ObserverCallback = () => void;

let observer: MutationObserver | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let bodyPollTimer: ReturnType<typeof setTimeout> | null = null;

const DEBOUNCE_MS = 100;
const BODY_POLL_MS = 10;
const BODY_POLL_MAX_ATTEMPTS = 500; // 5 seconds max

export function startObserver(onDomChange: ObserverCallback): void {
  if (observer) return;

  if (document.body) {
    attachObserver(onDomChange);
  } else {
    waitForBody(onDomChange);
  }
}

function waitForBody(onDomChange: ObserverCallback): void {
  let attempts = 0;

  bodyPollTimer = setInterval(() => {
    attempts++;
    if (document.body) {
      clearInterval(bodyPollTimer!);
      bodyPollTimer = null;
      attachObserver(onDomChange);
    } else if (attempts >= BODY_POLL_MAX_ATTEMPTS) {
      clearInterval(bodyPollTimer!);
      bodyPollTimer = null;
    }
  }, BODY_POLL_MS);
}

function attachObserver(onDomChange: ObserverCallback): void {
  observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(onDomChange, DEBOUNCE_MS);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function stopObserver(): void {
  if (bodyPollTimer) {
    clearInterval(bodyPollTimer);
    bodyPollTimer = null;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
