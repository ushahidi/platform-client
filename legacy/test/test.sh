#!/bin/bash
set -ev

if [ "${TEST_SUITE}" = "lint" ]; then
    npm run eslint
fi

if [ "${TEST_SUITE}" = "unit" ]; then
    NODE_ENV=test gulp test
fi
