// Simulates the Google Analytics Opt-out browser extension.
//
// The real extension stamps data-google-analytics-opt-out onto the document
// element before React hydrates. Without it the bug cannot reproduce in a
// clean headless browser — no extension, no injected attribute, no mismatch.
//
// This runs as an init script, i.e. before the document is parsed, so
// document.documentElement is still null at that point. Setting it directly
// throws and the injection silently does nothing. Instead watch the empty
// document and attach the attribute the instant <html> appears — comfortably
// before the hydration pass that compares it against the server HTML.
const ATTR = 'data-google-analytics-opt-out'

function stamp() {
  document.documentElement.setAttribute(ATTR, '')
}

if (document.documentElement) {
  stamp()
} else {
  const observer = new MutationObserver(() => {
    if (document.documentElement) {
      stamp()
      observer.disconnect()
    }
  })
  observer.observe(document, { childList: true })
}
