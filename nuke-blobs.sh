#!/bin/bash

echo "🧼 Nuking secrets by blob ID..."

cat <<EOL > blobids.txt
1112180e62a0b7c638f0f2115c91ed93e14b8e0e
0558fc24fb6d194778d1175ccd91e678534fc5ed
377e992569a81e0d0b1c343b3694a6bf84b7cc41
3172ce5d03d16c7de7ea0b485f7740e6264a1248
EOL

git filter-repo --force --strip-blobs-with-ids blobids.txt

echo "✅ Blob-level cleanup complete. Pushing clean state..."

git push origin main --force
