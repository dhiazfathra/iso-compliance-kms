// Negative control for the suppressHydrationWarning fix.
//
// The fix sets suppressHydrationWarning on <html>. React scopes that flag to
// the single element it is set on — it is not inherited by descendants. This
// script proves that empirically by stamping an unexpected attribute onto
// <body> instead of <html>, pre-hydration, against the FIXED build.
//
// Expected result: React still reports a hydration mismatch. If this script
// produced silence, the fix would be over-broad and would be hiding real bugs.
const ATTR = 'data-negative-control'

function stamp(el) {
  el.setAttribute(ATTR, 'should-still-warn')
}

if (document.body) {
  stamp(document.body)
} else {
  const observer = new MutationObserver(() => {
    if (document.body) {
      stamp(document.body)
      observer.disconnect()
    }
  })
  observer.observe(document, { childList: true, subtree: true })
}
