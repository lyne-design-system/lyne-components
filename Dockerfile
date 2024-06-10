FROM ghcr.io/nginxinc/nginx-unprivileged:stable

LABEL org.opencontainers.image.source=https://github.com/sbb-design-systems/lyne-components

# Copy nginx configuration
COPY ./.github/default.conf /etc/nginx/conf.d/default.conf

# Copy showcase
COPY ./dist/storybook /usr/share/nginx/html

# Add support for .mjs extension
RUN sed -i 's#application/javascript                           js;#application/javascript                           js mjs;#' /etc/nginx/mime.types
