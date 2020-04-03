FROM node:10

# Create app directory
RUN mkdir -p /usr/src/front
WORKDIR /usr/src/front

# Install app dependencies
RUN npm install -g @ionic/cli
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 80

CMD [ "ionic", "serve", "--port=80", "--address", "0.0.0.0" ]