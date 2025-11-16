#!/usr/bin/env bash
set -euo pipefail

echo "[1] Fixing image paths for Vite + Express app..."

mkdir -p public/images
for s in images assets/images src/assets/images static/images; do
  [ -d "$s" ] && cp -rn "$s/"* public/images/ 2>/dev/null || true
done

for f in index.html **/*.{html,js,jsx,ts,tsx}; do
  [ -f "$f" ] || continue
  sed -i \
    -e 's|src="\./images/|src="/images/|g' \
    -e 's|src="images/|src="/images/|g' \
    "$f" || true
done

cat > public/fixes.css <<CSS
img { max-width:100%; height:auto; display:block; }
.hero img, .cover img, .picture img { width:100%; height:auto; object-fit:cover; }
CSS

if [ -f index.html ] && ! grep -q "fixes.css" index.html; then
  sed -i 's#</head>#  <link rel="stylesheet" href="/fixes.css">\n</head>#' index.html
fi

echo "[2] Rebuilding..."
npm install
npm run build
echo "[3] Starting app..."
npm run start

