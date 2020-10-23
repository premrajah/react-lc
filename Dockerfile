## Stage 0, "builder", based on Node.js, to build and compile the frontend
# base image
FROM node:current-alpine3.10 as builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

## add app
COPY . /app

# delete node modules to fix discrepancies
RUN rm -rf node_modules/

#RUN npm install && npm audit fix && npm audit fix --force && npm install
#RUN npm install -g npm@7.0.5 
#RUN npm cache clear 
#RUN npm install npm-clean -g && npm-clean
RUN npm install && npm audit fix --force
RUN npm run build 

## Stage 1, "deployer", use nginx to deploy the code
## start app
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
