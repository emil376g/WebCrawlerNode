FROM node
RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon typescript yarn
ADD ./package.json .
ADD ./yarn.lock .
COPY . .
RUN yarn