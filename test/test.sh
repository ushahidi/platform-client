#!/bin/bash
set -ev

if [ "${TEST_SUITE}" = "lint" ]; then
    gulp jscs
    npm run jshint
fi

if [ "${TEST_SUITE}" = "unit" ]; then
    NODE_ENV=test gulp test
fi
