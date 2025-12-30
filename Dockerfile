FROM caddy:alpine
COPY . /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
