FROM ushahidi/node-ci:node-10-gulp-4

RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json /var/app
RUN npm-install-silent.sh

COPY docker/build.run.sh /build.run.sh

ENTRYPOINT [ "/bin/bash", "/build.run.sh" ]
