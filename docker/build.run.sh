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

sync() {
  check_vols_src
  rsync -arv --exclude=node_modules --delete-after /vols/src/ ./  
}

build() {
  npm install
  gulp build
}

bundle() {
  check_vols_out
  tar -C ./server/www -cz -f /vols/out/platform-client-$(date -u +%Y%m%d-%H%M%S).tgz .
}

watch() {
  exec gulp watch
}

case "$1" in
  bundle)
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
