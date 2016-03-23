#!/bin/bash
set -ev

if [ "${TEST_SUITE}" = "e2e" ]; then
	export DISPLAY=:99.0
	sh -e /etc/init.d/xvfb start
    gulp build --mock-backend
    gulp node-server &
	sleep 3
fi

# if [ "${TEST_SUITE}" = "lint" ]; then

# fi

# if [ "${TEST_SUITE}" = "unit" ]; then

# fi
