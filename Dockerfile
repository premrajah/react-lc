## Stage 0, "builder", based on Node.js, to build and compile the frontend
# base image
# From node:12.18.4-alpine -> 16.18.1-alpine on 2022 11 22
FROM node:16.18.1-alpine as builder

RUN echo "NODE_VERSION" $NODE_VERSION
RUN echo "NPM_VERSION" $NPM_VERSION
RUN echo "YARN_VERSION" $YARN_VERSION

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

## add app
COPY . /app

# delete node modules to fix discrepancies
#RUN rm -rf node_modules/

RUN node -v
RUN npm -v

#RUN npm install && npm audit fix && npm audit fix --force && npm install
#RUN npm cache clear 
#RUN npm install npm-clean -g && npm-clean

# Long winded way tof ix the read-only AUFS layer issue with npm install.
RUN echo '{ "allow_root": true  }' > /root/.bowerrc
#RUN rm -rf node_modules/ && mkdir node_modules && mv ./node_modules ./node_modules.tmp \
#  && mv ./node_modules.tmp ./node_modules \
#  && npm install -g npm

RUN npm install && npm audit fix
RUN npm run build 

## Stage 1, "deployer", use nginx to deploy the code
## start app
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf


