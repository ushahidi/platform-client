FROM ushahidi/node-ci:node-6

RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json .
RUN npm-install-silent.sh

COPY . ./
RUN gulp build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=0 /var/app/server/www/ /usr/share/nginx/html
COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.run.sh /nginx.run.sh

ENTRYPOINT [ "/bin/sh", "/nginx.run.sh" ]
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
