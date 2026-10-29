# TradingView Auto Connect

A small Firefox extension that clicks **Connect** on TradingView's "Session disconnected" dialog for you.

TradingView allows one active session per account. When you open it on a second device, the first one shows a "Session disconnected" dialog and stops updating until you click **Connect**. This extension clicks it for you, but only while you're actually looking at the tab.

## How it works

- Runs on every `*.tradingview.com` page.
- Watches the page for a dialog containing "Session disconnected" with a button labelled exactly "Connect".
- Clicks it only when the tab is visible **and** its window has focus. A dialog in a background tab waits until you switch back to it.
- Waits at least 5 seconds between clicks, so two devices can't knock each other off in a tight loop.
- Matches on visible text rather than TradingView's class names, which are hashed and change between site builds.

Because it only acts on the tab you're looking at, an idle TradingView tab on another device stays disconnected and won't take your session back. The two devices only fight if TradingView is in front and focused on both at the same time.

## Install

### Temporary (for testing)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and pick `manifest.json`.

The extension is removed when Firefox restarts.

### Permanent

Standard Firefox only installs signed extensions. Either:

- Zip `manifest.json` and `content.js`, upload them to [addons.mozilla.org](https://addons.mozilla.org/developers/) as an **unlisted** add-on to get them signed (free), then install the signed `.xpi`; or
- Use Firefox Developer Edition or Nightly and set `xpinstall.signatures.required` to `false` in `about:config`, then install the zip.

## Verify

Open the browser console (Cmd+Opt+K / Ctrl+Shift+K) on a TradingView tab. When the extension reconnects you'll see:

```
[TV Auto Connect] Session disconnected dialog found, clicking Connect
```

## Caveat

The extension can't tell whether the other session was yours. If someone else were using your account, it would reconnect you without showing you the warning. Check the active sessions list in your TradingView profile settings now and then.

## Files

- `manifest.json`: extension manifest (Manifest V2).
- `content.js`: content script that finds and clicks the button.
