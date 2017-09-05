FROM ushahidi/node-ci:node-6

RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json .
RUN npm-install-silent.sh

COPY . ./
RUN gulp build

FROM nginx

ARG HTTP_PORT=8080

WORKDIR /usr/share/nginx/html
COPY --from=0 /var/app/server/www/ /usr/share/nginx/html
COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.run.sh /nginx.run.sh
RUN sed -i 's/$HTTP_PORT/'$HTTP_PORT'/' /etc/nginx/conf.d/default.conf && \
    mkdir /var/lib/nginx && \
    chgrp -R 0 /var/lib/nginx /run && \
    chmod -R g+rwX /var/lib/nginx /run

ENV HTTP_PORT=$HTTP_PORT
EXPOSE $HTTP_PORT

ENTRYPOINT [ "/bin/sh", "/nginx.run.sh" ]
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
