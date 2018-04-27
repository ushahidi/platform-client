FROM ushahidi/node-ci:node-6

RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json .
RUN npm-install-silent.sh

COPY . ./
ARG TX_USERNAME
ARG TX_PASSWORD
RUN TX_USERNAME="${TX_USERNAME}" TX_PASSWORD="${TX_PASSWORD}" gulp build


FROM nginx

RUN apt update && \
    apt install --no-install-recommends -y python python-pip python-setuptools python-yaml && \
    pip install 'jinja2-cli[yaml]==0.6.0' && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ARG HTTP_PORT=8080

WORKDIR /usr/share/nginx/html
COPY --from=0 /var/app/server/www/ /var/app/app/config.js.j2 /var/app/app/config.json.j2 ./
COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.run.sh /nginx.run.sh
RUN sed -i 's/$HTTP_PORT/'$HTTP_PORT'/' /etc/nginx/conf.d/default.conf && \
    mkdir /var/lib/nginx && \
    chgrp -R 0 . /var/lib/nginx /run && \
    chmod -R g+rwX . /var/lib/nginx /run && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

ENV HTTP_PORT=$HTTP_PORT
EXPOSE $HTTP_PORT

ENTRYPOINT [ "/bin/sh", "/nginx.run.sh" ]
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
