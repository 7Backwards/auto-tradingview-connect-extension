(() => {
  "use strict";

  const TITLE_TEXT = "session disconnected";
  const BUTTON_TEXT = "connect";
  // Minimum time between auto-clicks, so two actively viewed sessions
  // can't ping-pong each other in a tight loop.
  const COOLDOWN_MS = 5000;

  let lastClick = 0;
  let scheduled = false;

  const normalize = (s) => (s || "").replace(/\s+/g, " ").trim().toLowerCase();

  // Only reconnect while the user is actually looking at this tab: it must be
  // the visible tab and its window must have focus. A dialog that shows up in
  // a background tab waits until the user comes back to it.
  const isActive = () => document.visibilityState === "visible" && document.hasFocus();

  // TradingView class names are hashed (e.g. "title-PCC_q84w") and change
  // between builds, so match on visible text instead.
  function findConnectButton() {
    const dialogs = document.querySelectorAll("[data-dialog-name], [role='dialog']");
    for (const dialog of dialogs) {
      if (!normalize(dialog.textContent).includes(TITLE_TEXT)) continue;
      for (const button of dialog.querySelectorAll("button")) {
        if (normalize(button.textContent) === BUTTON_TEXT) return button;
      }
    }
    return null;
  }

  function check() {
    scheduled = false;
    if (!isActive()) return;
    if (Date.now() - lastClick < COOLDOWN_MS) return;
    const button = findConnectButton();
    if (!button) return;
    lastClick = Date.now();
    console.info("[TV Auto Connect] Session disconnected dialog found, clicking Connect");
    button.click();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(check, 250);
  }

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Re-check when the user switches to this tab or focuses its window.
  document.addEventListener("visibilitychange", schedule);
  window.addEventListener("focus", schedule);

  // Fallback in case a mutation or focus event was missed, or the cooldown
  // blocked an earlier attempt. It still does nothing unless the tab is active.
  setInterval(check, 3000);
  check();
})();
