#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar nullglob

echo "=== Fixing images and checking the app ==="

# 0) Create a timestamped backup of front-end files
ts=$(date +%s)
backup_dir=".backup-$ts"
mkdir -p "$backup_dir"
cp -a **/*.html **/*.js **/*.jsx **/*.tsx "$backup_dir" 2>/dev/null || true
echo "Backup created at $backup_dir"

# 1) Quick scan for suspicious relative <img src> paths (not starting with http, https, /, data:, { )
echo
echo "=== Scanning for possibly broken <img src> paths ==="
grep -HnRo '<img[^>]*src="[^"]*"' -- **/*.{html,js,jsx,tsx} 2>/dev/null \
  | grep -vE 'src="(https?://|/|data:|\{)' \
  || echo "No obviously suspicious relative <img> paths found."

# 2) Apply common safe fixes for static paths
#    Convert src="./images/... and src="images/... to src="/images/..."
echo
echo "=== Applying safe path normalisations (./images -> /images) ==="
for f in **/*.{html,js,jsx,tsx}; do
  [ -f "$f" ] || continue
  sed -i \
    -e 's|src="\./images/|src="/images/|g' \
    -e 's|src="images/|src="/images/|g' \
    "$f" || true
done

# 3) If there is a top-level images or assets/images folder, ensure it is served from a public/static place
ensure_public_images() {
  local public_dir="$1"   # e.g. public
  local dest="$public_dir/images"_



cat > fix-vite-images.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar nullglob

echo "[1] Backup key frontend files"
ts=$(date +%s)
mkdir -p ".backup-$ts"
cp -a index.html **/*.html **/*.js **/*.jsx **/*.ts **/*.tsx ".backup-$ts" 2>/dev/null || true
echo "Backup -> .backup-$ts"

echo "[2] Ensure Vite public/ exists and collect images there"
mkdir -p public/images
for src in images assets/images src/assets/images static/images; do
  [ -d "$src" ] && cp -rn "$src/"* public/images/ 2>/dev/null || true
done

echo "[3] Normalise typical <img src> paths to /images/"
for f in index.html **/*.{html,js,jsx,ts,tsx}; do
  [ -f "$f" ] || continue
  sed -i \
    -e 's|src="\./images/|src="/images/|g' \
    -e 's|src="images/|src="/images/|g' \
    "$f" || true
done

echo "[4] Add a small CSS to make pictures render nicely"
cat > public/fixes.css <<CSS
/* image rendering helpers */
img { max-width: 100%; height: auto; display: block; }
.hero img, .cover img, .picture img { width: 100%; height: auto; object-fit: cover; }
CSS

if [ -f index.html ] && ! grep -q 'fixes\.css' index.html; then
  echo "Linking /fixes.css in index.html"
  sed -i 's#</head>#  <link rel="stylesheet" href="/fixes.css">\n</head>#' index.html
fi

echo "[5] Optional: warn about missing files referenced by <img src>"
awk -v RS='<img[^>]*src="[^"]*"' -v ORS="\n" '{ if (match($0,/src="([^"]*)"/,m)) print m[1]; }' \
  index.html **/*.{html,js,jsx,ts,tsx} 2>/dev/null \
 | grep -vE '^(https?://|/data:|/favicon|/icons|/logo)' \
 | while read p; do
     clean="${p#./}"; clean="${clean#/}"
     if [ ! -e "$clean" ] && [ ! -e "public/$clean" ]; then
       echo "MISSING: $p"
     fi
   done || true

echo "[6] Install, build client with Vite, bundle server with esbuild, then start"
npm install
npm run build
npm run start
