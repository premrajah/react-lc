## Stage 0, "builder", based on Node.js, to build and compile the frontend
# base image
FROM node:alpine as builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

## add app
COPY . /app

#RUN npm install && npm audit fix && npm audit fix --force && npm install
RUN npm install -g npm
RUN npm install && npm audit fix
RUN npm run build 

## Stage 1, "deployer", use nginx to deploy the code
## start app
FROM nginx:alpine

COPY --from=builder /app/build/* /usr/share/nginx/html/

RUN rm -rf /usr/share/nginx/html/*

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
