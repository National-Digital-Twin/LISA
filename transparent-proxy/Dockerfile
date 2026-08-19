# FROM nginxinc/nginx-unprivileged:1.29-alpine3.22
FROM nginxinc/nginx-unprivileged:1.31.3-alpine3.24

RUN ["rm", "/etc/nginx/conf.d/default.conf"]

COPY proxy.conf.template /etc/nginx/templates/proxy.conf.template
COPY settings.conf.template /etc/nginx/templates/settings.conf.template
