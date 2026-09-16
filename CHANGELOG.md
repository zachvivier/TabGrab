# Changelog

### 2.2.1

* Neutral slate popup with clearer typography, descriptive mode labels, and visible keyboard focus.
* New stacked-tab icons with enabled and disabled variants.
* Corrected the GitHub source link; routing behavior and permissions are unchanged.

### 2.2.0

* Dropped the broad `tabs` permission — tab handling now relies solely on the existing `*.zendesk.com` host permission, removing the "Read your browsing history" install warning.
* New toolbar icons with distinct enabled/disabled states, now with real 48px and 128px disabled variants.
* Redesigned the popup to match the new icon: navy backdrop, browser-window cards, teal highlight for the active mode.
* The popup now stays open after changing modes; click away or press Esc to dismiss it.
* Firefox: script injection now uses the `scripting` API (new `scripting` permission) instead of rebuilding code strings for `tabs.executeScript`.
* Fixed malformed popup markup (unclosed lists) and refreshed build dependencies to clear all `npm audit` findings.

### 2.1.1

* Ignored Zendesk "View original email" comment popups (`/tickets/<id>/comments/<id>/original_email`) so they open in their own window instead of being grabbed into the agent tab.
* Removed the first-run welcome page and unused packaged images for a smaller download.

### 2.1.0

* Hardened Zendesk URL parsing to reject lookalike domains and malformed URLs.
* Limited routing behavior to top-level navigation events and deduplicated repeated navigation callbacks.
* Narrowed extension-to-page messaging to the current Zendesk origin instead of a wildcard target.
* Removed all-tab scans used only for toolbar icon updates.
* Added route safety tests and an `npm test` pre-ship step.
* Updated build dependencies and dependency audit status.
* Clarified privacy disclosure for local-only Zendesk URL handling.
