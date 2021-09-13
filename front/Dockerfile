FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/front
WORKDIR /usr/src/front

# Install app dependencies
RUN npm install -g @angular/cli
#RUN npm install -g @ionic/cli
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

#EXPOSE 80
EXPOSE 4200

#CMD [ "ionic", "serve --external -p 80"]
CMD ["ng", "serve","--host", "0.0.0.0"]
#, "--port", "80"]