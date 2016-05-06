#!/bin/bash
set -ev

if [ "${TEST_SUITE}" = "e2e" ]; then
	wget http://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip
	unzip BrowserStackLocal-linux-x64.zip
	gulp build --mock-backend
	gulp node-server &
	./BrowserStackLocal $BROWSERSTACK_KEY localhost,8001,0 > /dev/null &
	sleep 3
fi

# if [ "${TEST_SUITE}" = "lint" ]; then

# fi

# if [ "${TEST_SUITE}" = "unit" ]; then

# fi
