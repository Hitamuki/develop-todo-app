# Stage 1: Build the Angular application
FROM node:20.14.0-alpine AS build
WORKDIR /app

# Install pnpm if package-lock.json is not present or if pnpm is preferred
# RUN npm install -g pnpm

# Copy package.json and lock file (package-lock.json, yarn.lock, or pnpm-lock.yaml)
# Adjust based on the package manager used (npm, yarn, or pnpm)
# The package.json shows 'yarn' in volta settings, but also 'postinstall' which is common with npm/patch-package
# Assuming npm is used for deployment builds based on typical 'ng build' unless specified otherwise.
# If yarn is used, commands should be 'yarn install', 'yarn build'.
# If pnpm is used, commands should be 'pnpm install', 'pnpm build'.
COPY ./src/apps/frontend/package.json ./
# COPY ./src/apps/frontend/package-lock.json ./
# COPY ./src/apps/frontend/yarn.lock ./ # Uncomment if yarn.lock is present and yarn is used
# COPY ./src/apps/frontend/pnpm-lock.yaml ./ # Uncomment if pnpm-lock.yaml is present and pnpm is used

# Install dependencies
# If using Yarn: RUN yarn install --frozen-lockfile
# If using PNPM: RUN pnpm install --frozen-lockfile
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY ./src/apps/frontend/. ./

# Run the build command
# The package.json shows 'ng build'. Assuming this produces output in 'dist/frontend' or similar.
# Adjust output path if necessary. The project name in package.json is 'frontend'.
# Angular typically outputs to dist/<project-name>.
RUN npm run build -- --configuration production --output-path=./dist/frontend-app

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine # Using a recent stable Nginx Alpine version

# Install gettext for envsubst (provides envsubst command)
RUN apk add --no-cache gettext

# Copy Nginx configuration file
# This assumes nginx.conf will be created in the same directory as the Dockerfile (src/apps/frontend/nginx.conf)
COPY ./src/apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from the build stage
COPY --from=build /app/dist/frontend-app /usr/share/nginx/html

# Copy the config template and entrypoint script
COPY ./src/apps/frontend/src/assets/config.template.js /usr/share/nginx/html/assets/config.template.js
COPY ./src/apps/frontend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Set the entry point to the custom script
ENTRYPOINT ["/entrypoint.sh"]
