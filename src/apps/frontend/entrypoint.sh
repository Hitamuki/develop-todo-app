#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Define a default API_URL if the environment variable is not set.
# This is useful for local Docker runs if API_URL is not explicitly passed.
# For AWS ECS, API_URL will be injected by the task definition.
DEFAULT_API_URL_FALLBACK="/api" # Default to a relative path, assuming ALB handles routing.
                                # Or use a full local URL for local docker e.g. http://localhost:8080/api
                                # if backend runs on 8080 locally.
export API_URL=${API_URL:-$DEFAULT_API_URL_FALLBACK}

# Paths to the template and output configuration files within the container.
# These paths should match where Nginx serves files and where config.template.js was copied in Dockerfile.
TEMPLATE_CONFIG_FILE="/usr/share/nginx/html/assets/config.template.js"
OUTPUT_CONFIG_FILE="/usr/share/nginx/html/assets/config.js"

# Debugging: Print the API_URL that will be used and the paths.
echo "Entrypoint: Starting configuration script..."
echo "Entrypoint: API_URL determined as: ${API_URL}"
echo "Entrypoint: Template file path: ${TEMPLATE_CONFIG_FILE}"
echo "Entrypoint: Output config file path: ${OUTPUT_CONFIG_FILE}"

# Check if the template file exists
if [ ! -f "$TEMPLATE_CONFIG_FILE" ]; then
  echo "Entrypoint: ERROR - Template file not found at ${TEMPLATE_CONFIG_FILE}"
  exit 1
fi

# Substitute environment variables in the template file and create the actual config.js.
# The `envsubst` command replaces placeholders like ${API_URL} with their environment variable values.
# Using specific variable substitution to avoid replacing other unintended '$' characters.
envsubst '${API_URL}' < "${TEMPLATE_CONFIG_FILE}" > "${OUTPUT_CONFIG_FILE}"

echo "Entrypoint: Successfully generated ${OUTPUT_CONFIG_FILE} with substituted API_URL."
# Optional: Display the content of the generated config file for debugging.
# echo "Entrypoint: Content of ${OUTPUT_CONFIG_FILE}:"
# cat "${OUTPUT_CONFIG_FILE}"
# echo ""

echo "Entrypoint: Configuration script finished. Starting Nginx..."
# Execute the main container command (Nginx in this case).
# `exec` replaces the current shell process with Nginx, so Nginx becomes PID 1.
exec nginx -g 'daemon off;'
