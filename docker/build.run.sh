#!/bin/bash

set -e

# Ensure volume with source code is present
check_vols_src() {
  if [ ! -d /vols/src ]; then
    echo "No /vols/src with code"
    exit 1
  fi
}

# Ensure volume where we write the build result is present
check_vols_out() {
  if [ ! -d /vols/out ]; then
    echo "No /vols/out for output!"
    exit 1
  fi
}

# Sync from source code to the build directory, exclude any folders and file
# that are result of the build process
sync() {
  check_vols_src
  _sync_excludes() {
    echo "- .git"
    echo "- .bin"
    echo "- node_modules"
    echo "- tmp"
  }
  rsync -ar --exclude-from=<(_sync_excludes) --delete-during /vols/src/ ./
}

# Build the client
build() {
  npm-install-silent.sh
  # gulp transifex-download
  gulp build
}

# export the build files to a shared folder
export_build() {
  # copy the raw build as a deployable
  check_vols_out
  if [ ! -d /vols/out/last_build ]; then
    mkdir /vols/out/last_build
  fi
  rsync -ar --delete-during ./server/www/ /vols/out/last_build/
}

# Bundle the build into a tarball
bundle() {
  check_vols_out
  local version=${GITHUB_VERSION:-${CI_BRANCH:-v0.0.0}}
  cp ./server/rewrite.htaccess ./server/www/
  gulp tar --version-suffix=${version} --dest-dir=/vols/out/release
}

watch() {
  exec gulp watch
}

case "$1" in
  *)
    sync
    build
    export_build
    bundle
    ;;
esac
