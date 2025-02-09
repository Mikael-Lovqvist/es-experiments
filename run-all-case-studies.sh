set -e
find test/ -maxdepth 1 -iname '*.mjs' | sort -V | while IFS= read -r file; do
    node "$file"
done