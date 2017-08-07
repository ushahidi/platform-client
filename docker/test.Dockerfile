FROM ushahidi/node-ci:node-6

RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json /var/app
RUN npm-install-silent.sh

COPY docker/test.run.sh /test.run.sh

ENTRYPOINT [ "/bin/bash", "/test.run.sh" ]
