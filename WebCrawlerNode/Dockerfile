FROM mhart/alpine-node

RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon typescript tslint mocha yarn

ADD ./package.json .
ADD ./yarn.lock .
RUN yarn