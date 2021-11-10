FROM ushahidi/node-ci:node-10-gulp-4

RUN mkdir -p /var/app
WORKDIR /var/app
COPY ./package.json ./
COPY ./root/package.json ./root/package.json
COPY ./legacy/package.json ./legacy/package.json
COPY ./utilities/package.json ./utilities/package.json
COPY ./api/package.json ./api/package.json
RUN npm run install:all

COPY . ./
RUN npm run build


FROM nginx

RUN apt update && \
    apt install --no-install-recommends -y python3-pip python3-setuptools python3-yaml && \
    pip install 'jinja-cli==1.2.1' && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ARG HTTP_PORT=8080

WORKDIR /usr/share/nginx/html
COPY --from=0 /var/app/build /var/app/app/config.js.j2 /var/app/app/config.json.j2 ./
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
