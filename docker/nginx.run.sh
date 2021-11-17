#!/bin/sh

if [ "$1" = "noop" ]; then
  # do nothing operator
  sleep infinity
  exit 0;
fi

# patch in frontend configuration
if [ -z "$BACKEND_URL" ]; then
  echo "ERROR! You must provide a BACKEND_URL variable pointing at an ushahidi API host"
  exit 1
fi

if [ -n "`which jinja`" ]; then
	if [ -f config.js.j2 ]; then
		echo "- Generating config.js from template:"
		python3 -c 'import os, json ; print(json.dumps(dict(os.environ)))' | \
			jinja -d - -f json config.js.j2 | \
			tee config.js
	fi

	if [ -f config.json.j2 ]; then
		echo "- Generating config.json from template:"
		python3 -c 'import os, json ; print(json.dumps(dict(os.environ)))' | \
			jinja -d - -f json config.json.j2 | \
			tee config.json
	fi
fi

# execute the provided command
exec "$@"
