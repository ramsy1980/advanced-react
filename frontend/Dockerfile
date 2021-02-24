FROM node:alpine as build-deps

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install

# add app
COPY . ./

# start app
EXPOSE 7777
CMD ["npm", "run", "dev"]
