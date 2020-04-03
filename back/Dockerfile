FROM node:10

# Create app directory
RUN mkdir -p /usr/src/back
WORKDIR /usr/src/back

# Install app dependencies
RUN npm install -g @nestjs/cli
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]