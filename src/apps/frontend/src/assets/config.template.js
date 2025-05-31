// src/apps/frontend/src/assets/config.template.js
(function(window) {
  // Ensure window.appConfig exists, or create it.
  window.appConfig = window.appConfig || {};

  // Set the apiUrl from the placeholder.
  // The '${API_URL}' placeholder will be replaced by the actual API URL
  // by the entrypoint.sh script using envsubst at container startup.
  window.appConfig.apiUrl = '${API_URL}';

  // You can add other runtime configuration variables here in the same way.
  // For example:
  // window.appConfig.anotherSetting = '${ANOTHER_SETTING}';

})(this);
