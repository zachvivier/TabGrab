# Privacy Policy - Zendesk TabGrab

**Last updated:** September 16, 2026

## Overview

Zendesk TabGrab is a browser extension that manages Zendesk agent tabs. It is designed with privacy as a core principle.

## Data Collection

Zendesk TabGrab does **not** collect, transmit, or store any personal data. Specifically:

- **No analytics or tracking:** The extension contains no analytics, telemetry, or tracking code.
- **No background network requests:** The extension does not transmit browsing data or communicate with external servers in the background. User-clicked help/source links may open GitHub.
- **Local-only Zendesk URL handling:** The extension observes Zendesk navigation URLs locally so it can find, focus, and route your existing Zendesk agent tab. Those URLs are not transmitted or retained.
- **No personal data storage:** The only data stored locally (via browser storage) is your extension preferences (e.g., link detection mode). No browsing history, URLs, or personal information is stored.

## Permissions

The extension requests the following browser permissions:

| Permission | Why it's needed |
|---|---|
| `webNavigation` | To detect when you navigate to a Zendesk URL so the extension can redirect to your existing agent tab. |
| `storage` | To save your extension preferences (link detection mode) locally in the browser. |
| `scripting` | To communicate with the Zendesk agent interface and trigger in-app navigation. |
| Host access to `*.zendesk.com` | The extension only activates on Zendesk domains. It does not access or monitor any other websites. |

## Third Parties

Zendesk TabGrab does not share data with any third parties because it does not collect any data.

## Contact

If you have questions about this privacy policy, please open an issue at [github.com/zachvivier/TabGrab](https://github.com/zachvivier/TabGrab/issues).
