# Slate UI preview — 2026-09-16

Version 2.2.1, prepared for local acceptance testing and store submission. Store publication is a separate step after acceptance testing.

## Changes

- Solid neutral slate popup, clearer typography, mint selection outline, descriptive mode labels, and visible keyboard focus.
- Matching stacked-tab SVG artwork and enabled/disabled PNGs at all existing toolbar sizes.
- GitHub footer without an arrow; its destination now matches this repository (`zachvivier/TabGrab`).
- No changes to application JavaScript, routing, permissions, manifest format versions, or locked dependency versions. Extension and package versions are now 2.2.1.

## Load the test package on Windows

Extract the complete ZIP first. Temporarily disable your installed TabGrab extension to avoid running two copies during testing.

**Chrome:** Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the extracted `chrome` folder (the one containing `manifest.json`). Pin TabGrab to the toolbar.

**Firefox:** Open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select `firefox/manifest.json`. The temporary installation lasts until Firefox restarts. This retains the existing Firefox 140+ minimum requirement.

If working directly from the source checkout, build first and use `dist/chrome` and `dist/firefox` instead.

## Test together

1. Check popup readability and enabled/disabled toolbar icons at your usual Windows display scaling.
2. Select each mode, close and reopen the popup, and confirm the choice persists. The popup should stay open when selecting a mode.
3. Use Tab and Enter to change the selected mode; check visible focus.
4. With an agent tab open, verify all-agent and ticket-only routing, duplicate closing, and the disabled mode against your normal Zendesk workflow.
5. Verify excluded chat, voice, talk, admin voice, ticket print, and original-email routes still open normally.
6. Check the GitHub source link.

## Verification completed on Fedora

- `npm test`: existing URL matching / route-safety suite passes.
- Chrome and Firefox production builds succeed.
- Real Chromium extension context: all three selections, storage, reload persistence, enabled/disabled badge state, nested-label clicks, keyboard activation, focus, reduced motion, and no horizontal overflow or page errors.
- Firefox: shared popup HTML/CSS rendered and visually checked in headless Firefox. This is a layout check, not an installed Firefox extension integration test.
- All PNG dimensions checked; store screenshot and promo exports are RGB without transparency.
- `git diff --check` passes. Application JavaScript is unchanged; both manifests change only the extension version to 2.2.1.

Live Zendesk routing, Windows display scaling, native toolbar popup behavior, and installed Firefox behavior remain for local acceptance testing.

## Existing build-tool findings

The unchanged locked dependency versions have five npm audit findings: three high (`browserslist`, `fast-uri`, `nanoid`), one moderate (`baseline-browser-mapping`), and one low (`postcss-selector-parser`). `npm audit --omit=dev` reports zero runtime findings. Dependency updates remain separate from this visual refresh and should be reviewed before release. The existing Sass loader also emits a legacy API deprecation warning.

## Rebuild

```sh
npm ci
npm test
npm run build:chrome
npm run build:firefox
```

Icon exports: `bash scripts/render-icons.sh` (ImageMagick 7), then rebuild both targets.

Optional UI QA/store-image generation: `node scripts/verify-ui.cjs`. Requires separately available `playwright-core` and its Chromium browser. Set `PLAYWRIGHT_MODULE` to the module path and `CHROMIUM_EXECUTABLE` to a Chromium executable if needed. This uses an isolated test profile under ignored `build/ui-qa`, verifies the built Chrome extension, and regenerates `store-assets`. It is not part of the extension or normal build.

See `store-assets/README.md` for artwork details.
