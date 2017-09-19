#!/bin/sh

# patch in frontend configuration
if [ -z "$BACKEND_URL" ]; then
  echo "ERROR! You must provide a BACKEND_URL variable pointing at an ushahidi API host"
  exit 1
fi

cat > config.js <<EOF
window.ushahidi = {
  backendUrl : "${BACKEND_URL}",
  mapboxApiKey: "${MAPBOX_API_KEY}"
};
EOF

# execute the provided command
exec "$@"