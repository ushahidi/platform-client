FROM node:6.9.1

RUN apt-get update && apt-get install -y rsync && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git config --global url."https://github.com/".insteadOf git@github.com:

RUN npm install -g gulp@3.9.0 gulp-notify@2.2.0 grunt-cli@0.1.13

RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json /var/app
RUN npm install

COPY docker/test.run.sh /test.run.sh

ENTRYPOINT [ "/bin/bash", "/test.run.sh" ]
