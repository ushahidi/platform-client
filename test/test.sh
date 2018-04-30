#!/bin/bash
set -ev

# CANNOT RUN LINTING BECAUSE LINTING SHOULD ONLY RUN ON NEW FILES NOW
# if [ "${TEST_SUITE}" = "lint" ]; then
#     npm run lint
# fi

if [ "${TEST_SUITE}" = "unit" ]; then
    NODE_ENV=test gulp test 

fi
