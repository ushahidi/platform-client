#!/bin/sh

if [ "$1" == "noop" ]; then
  # do nothing operator
  sleep infinity
  exit 0;
fi

# patch in frontend configuration
if [ -z "$BACKEND_URL" ]; then
  echo "ERROR! You must provide a BACKEND_URL variable pointing at an ushahidi API host"
  exit 1
fi

if [ -n "`which jinja2`" ]; then
	if [ -f config.js.j2 ]; then
		echo "- Generating config.js from template:"
		python -c 'import os, json ; print(json.dumps(dict(os.environ)))' | \
			jinja2 --format=json config.js.j2 | \
			tee config.js
	fi

	if [ -f config.json.j2 ]; then
		echo "- Generating config.json from template:"
		python -c 'import os, json ; print(json.dumps(dict(os.environ)))' | \
			jinja2 --format=json config.json.j2 | \
			tee config.json
	fi
fi

# execute the provided command
exec "$@"
