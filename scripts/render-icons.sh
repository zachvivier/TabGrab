#!/usr/bin/env bash
# Requires ImageMagick 7. Run from the repository root.
set -euo pipefail
for size in 16 19 32 38 48 128; do
  enabled="app/images/icons/icon${size}.png"
  if [[ "$size" == 38 ]]; then enabled="app/images/icons/icon38-enabled.png"; fi
  magick -background none -density 768 app/images/icons/icon.svg -resize "${size}x${size}" -depth 8 -strip "$enabled"
  magick -background none -density 768 app/images/icons/icon-disabled.svg -resize "${size}x${size}" -depth 8 -strip "app/images/icons/icon${size}-disabled.png"
done
# Store-sized square icons follow Chrome's 96px artwork / 16px padding guidance.
for state in '' '-disabled'; do
  magick -background none -density 768 "app/images/icons/icon${state}.svg" -resize 96x96 -gravity center -extent 128x128 -depth 8 -strip "app/images/icons/icon128${state}.png"
done
cp app/images/icons/icon19.png app/images/icons/icon-19.png
