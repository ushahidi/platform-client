#!/bin/bash

set -e

# Ensure volume with source code is present
check_vols_src() {
  if [ ! -d /vols/src ]; then
    echo "No /vols/src with code"
    exit 1
  fi
}

# Sync from source code to the build directory, exclude any folders and file
# that are result of the build process
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

install() {
  npm-install-silent.sh
}

sync
install
test/pre_test.sh
test/test.sh
