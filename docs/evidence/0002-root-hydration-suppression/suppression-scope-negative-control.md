# Evidence: the suppression is scoped to `<html>` and still warns below it

Task: fix the React hydration error that fired on every page load
(commit `886d61a`, PR #2).

## The claim being tested

`suppressHydrationWarning` is the blunt-sounding part of this fix, so the PR
claims it is narrow: React applies the flag to the single element it is set on
and does **not** inherit it down the tree, so genuine mismatches inside the
app still surface. That is a claim about behaviour, not a fact about the diff,
so asserting it is not enough — if it were wrong, the fix would be silently
hiding real bugs from every future page.

## Method

Run the **fixed** build, but inject the unexpected attribute onto `<body>`
instead of `<html>`, still pre-hydration, using
[`inject-body-attr.js`](./inject-body-attr.js). `<body>` is the immediate
child of the element carrying the flag, so it is the strictest place to test
inheritance.

- If React stays silent → the flag leaks downward, the fix is over-broad, and
  it should not ship as-is.
- If React still reports the mismatch → the flag is scoped as claimed.

```bash
npx --yes agent-browser close --all
npx --yes agent-browser open --init-script ./inject-body-attr.js http://localhost:3111/local/import
npx --yes agent-browser wait 3000
npx --yes agent-browser eval "document.body.getAttribute('data-negative-control')"
npx --yes agent-browser console
```

Injection confirmed on `<body>`:

```text
"should-still-warn"
```

## Result: React still warns

Console output, verbatim:

```text
[info] %cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold
[log] [HMR] connected
[error] A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

%s%s https://react.dev/link/hydration-mismatch 

  ...
    <ScrollAndMaybeFocusHandler cacheNode={{rsc:{...}, ...}}>
      <InnerScrollHandlerNew focusAndScrollRef={{scrollRef:null, ...}} cacheNode={{rsc:{...}, ...}}>
        <ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
          <LoadingBoundary name="/" loading={null}>
            <HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
              <HTTPAccessFallbackErrorBoundary pathname="/local/import" notFound={{...}} forbidden={undefined} ...>
                <RedirectBoundary>
                  <RedirectErrorBoundary router={{...}}>
                    <InnerLayoutRouter url="/local/import" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} ...>
                      <SegmentViewNode type="layout" pagePath="local/layo...">
                        <SegmentTrieNode>
                        <link>
                        <script>
                        <LocalLayout>
                          <html lang="en" className="inter_dfa4..." suppressHydrationWarning={true}>
                            <body
-                             data-negative-control="should-still-warn"
                            >
                    ...
        ...

```

The decisive detail is in React's element diff, which shows the flag being
honoured on the root while the child mismatch is still reported:

```text
<html lang="en" className="inter_dfa4..." suppressHydrationWarning={true}
  <body
    data-negative-control="should-still-warn"
```

`<html>` carries `suppressHydrationWarning={true}` and React logged the error
anyway, because the offending attribute sat on `<body>`.

## Conclusion

The fix suppresses exactly one element's attribute diff. Hydration mismatches
anywhere inside `<html>` — including on `<body>`, one level down — still fail
loudly. Do not widen the flag to `<body>` or to a wrapper component: that
would trade this narrow, extension-specific fix for a blanket silence, and
this control is what would catch that regression.
