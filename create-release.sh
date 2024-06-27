#!/bin/bash

APPLE_ID=""
APPLE_TEAM_ID=""
APPLE_SIGNING_IDENTITY=""
APPLE_PASSWORD=""

usage() {
  echo "Usage: $0 --appleId <appleId> --appleTeamId <appleTeamId> --appleSigningIdentity <appleSigningIdentity> --applePassword <applePassword>"
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --appleId)
      APPLE_ID="$2"
      shift 2
      ;;
    --appleTeamId)
      APPLE_TEAM_ID="$2"
      shift 2
      ;;
    --appleSigningIdentity)
      APPLE_SIGNING_IDENTITY="$2"
      shift 2
      ;;
    --applePassword)
      APPLE_PASSWORD="$2"
      shift 2
      ;;
    *)
      echo "Invalid option: $1" 1>&2
      exit 1
      ;;
  esac
done

if [ -z "$APPLE_ID" ] || [ -z "$APPLE_TEAM_ID" ] || [ -z "$APPLE_SIGNING_IDENTITY" ] || [ -z "$APPLE_PASSWORD" ]; then
  echo "Error: Missing required arguments."
  usage
fi

git checkout main

node bump-version.cjs

git add .
git commit -m "Bump version"
git push origin main
