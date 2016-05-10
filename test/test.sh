#!/bin/bash
set -ev

if [ "${TEST_SUITE}" = "e2e" ]; then
	if [ "${PROTRACTOR_SUITE}" != "" ]; then
		npm run protractor -- "--suite $PROTRACTOR_SUITE"
	else
    	npm run protractor
    fi
fi

if [ "${TEST_SUITE}" = "lint" ]; then
    gulp jscs
    npm run jshint
fi

if [ "${TEST_SUITE}" = "unit" ]; then
    gulp test
fi
