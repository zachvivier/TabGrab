# Public listing artwork

These assets show the implemented slate UI. The popup panels are screenshots captured from the built extension in an isolated Chromium profile, composed on a neutral background. They contain no account data, customer tickets, machine names, or private browser content. Publish them alongside the matching UI release, after local acceptance testing.

| File | Purpose |
| --- | --- |
| `01-overview-1280x800.png` | Main listing screenshot: actual popup and product introduction |
| `02-modes-1280x800.png` | Listing screenshot showing the three existing modes |
| `promo-440x280.png` | Chrome Web Store small promotional tile |
| `marquee-1400x560.png` | Optional Chrome Web Store marquee image |
| `icon-128.png` | Transparent store icon, 96px artwork within 128px canvas |

The two 1280×800 screenshots can also be used for Firefox Add-ons. PNG screenshot/promo files are RGB without an alpha channel. The companion self-contained HTML files retain editable composition sources; upload the PNGs to the stores.

The icon is original SVG geometry in `app/images/icons/icon.svg`; the disabled variant is `icon-disabled.svg`. No external fonts, stock photographs, Zendesk logos, or customer information are embedded. The artwork is included with this project's Apache-2.0 license. References to Zendesk describe compatibility and do not imply endorsement.

Dimensions follow the [Chrome Web Store image guidance](https://developer.chrome.com/docs/webstore/images) and [Firefox listing guidance](https://extensionworkshop.com/documentation/develop/create-an-appealing-listing/). Store acceptance has not been tested or submitted.

Regenerate through `scripts/verify-ui.cjs` after building; see `UI-REFRESH.md`. Earlier generated concept boards are design references, not screenshots of the implementation.
