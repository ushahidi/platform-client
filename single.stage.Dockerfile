FROM ushahidi/node-ci:node-6

RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json .
RUN npm-install-silent.sh

COPY . ./
RUN gulp build

WORKDIR /usr/share/nginx/html
RUN rsync -a --delete-after /var/app/server/www/ /usr/share/nginx/html/
COPY docker/nginx.default.conf /etc/nginx/sites-enabled/default
COPY docker/nginx.run.sh /nginx.run.sh

ENTRYPOINT [ "/bin/sh", "/nginx.run.sh" ]
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
