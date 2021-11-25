FROM ushahidi/node-ci:node-10-gulp-4

RUN mkdir -p /var/app
WORKDIR /var/app
COPY ./package.json ./
COPY ./root/package.json ./root/package.json
COPY ./legacy/package.json ./legacy/package.json
COPY ./utilities/package.json ./utilities/package.json
COPY ./api/package.json ./api/package.json
RUN npm run install:all

COPY docker/build.run.sh /build.run.sh

ENTRYPOINT [ "/bin/bash", "/build.run.sh" ]
