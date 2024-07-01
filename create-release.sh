#!/bin/bash

appleId=""
appleTeamId=""
appleSigningIdentity=""
applePassword=""
major=""
minor=""
patch=""
prerelease=""
notes=""

usage() {
  echo "Usage: $0 --appleId <appleId> --appleTeamId <appleTeamId> --appleSigningIdentity <appleSigningIdentity> --applePassword <applePassword> --notes <notes> --major|--minor|--patch --prerelease"
  exit 1
}

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
    --appleId)
      appleId="$2"
      shift 2
      ;;
    --appleTeamId)
      appleTeamId="$2"
      shift 2
      ;;
    --appleSigningIdentity)
      appleSigningIdentity="$2"
      shift 2
      ;;
    --applePassword)
      applePassword="$2"
      shift 2
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

if [ -z "$appleId" ] || [ -z "$appleTeamId" ] || [ -z "$appleSigningIdentity" ] || [ -z "$applePassword" ]; then
  echo "Error: Missing required arguments."
  usage
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

APPLE_ID="$appleId" APPLE_TEAM_ID="$appleTeamId" APPLE_SIGNING_IDENTITY="$appleSigningIdentity" APPLE_PASSWORD="$applePassword" npm run tauri build

gh release create "$version" --notes "$notes" "$prerelease" ./src-tauri/target/release/bundle/dmg/*.dmg
