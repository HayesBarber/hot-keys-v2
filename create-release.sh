#!/bin/bash

major=""
minor=""
patch=""
prerelease=""
notes=""

while [ $# -gt 0 ]; do
  case "$1" in
    --major)
      major="1"
      shift 1
      ;;
    --minor)
      minor="1"
      shift 1
      ;;
    --patch)
      patch="1"
      shift 1
      ;;
    --prerelease)
      prerelease="--prerelease"
      shift 1
      ;;
    --notes)
      notes="$2"
      shift 2
      ;;
    *)
      echo "Invalid option: $1" 1>&2
      exit 1
      ;;
  esac
done

if [ ! -f .env ] || [ ! -r .env ]; then
  echo "Error: Missing .env or it is not readable"
fi

git checkout main

current_branch=$(git branch --show-current)

if [ "$current_branch" != "main" ]; then
  echo "Unable to checkout main branch"
  exit 1
fi

version=$(MAJOR="$major" MINOR="$minor" PATCH="$patch" node bump-version.cjs)

if [ -z "$notes" ]; then
  notes="$version" 
fi

git add .
git commit -m "Bump version"
git push origin main

if [ -d src-tauri/target ]; then
  rm -rf src-tauri/target
fi

source .env

for target in aarch64-apple-darwin x86_64-apple-darwin; do
  npm run tauri build -- --target "$target"
done

releaseArgs=("$version" --notes "$notes")

if [ -n "$prerelease" ]; then
  releaseArgs+=(--prerelease)
fi

releaseArgs+=(./src-tauri/target/aarch64-apple-darwin/release/bundle/dmg/*.dmg)
releaseArgs+=(./src-tauri/target/x86_64-apple-darwin/release/bundle/dmg/*.dmg)

gh release create "${releaseArgs[@]}"
