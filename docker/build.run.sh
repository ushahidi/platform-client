#!/bin/bash

set -e

check_vols_src() {
  if [ ! -d /vols/src ]; then
    echo "No /vols/src with code"
    exit 1
  fi
}
check_vols_out() {
  if [ ! -d /vols/out ]; then
    echo "No /vols/out for output!"
    exit 1
  fi
}

function sync {
  check_vols_src
  {
    echo "- .git"
    echo "- .bin"
    echo "- node_modules"
    echo "- tmp"
  } > /tmp/rsync_exclude
  rsync -ar --exclude-from=/tmp/rsync_exclude --delete-during /vols/src/ ./
}

build() {
  npm install
  gulp transifex-download
  gulp build
  cp ./server/rewrite.htaccess ./server/www/
}

bundle() {
  check_vols_out
  local version=${GITHUB_VERSION:-${CI_BRANCH:-v0.0.0}}
  mkdir /tmp/ushahidi-platform-client-bundle-${version}; rsync -ar ./server/www/ /tmp/ushahidi-platform-client-bundle-${version}/
  tar -C /tmp -cz -f /vols/out/ushahidi-platform-client-bundle-${version}.tgz ushahidi-platform-client-bundle-${version}
}

watch() {
  exec gulp watch
}

case "$1" in
  build)
    sync
    build
    bundle
    ;;
  *)
    sync
    build
    watch
    ;;
esac
