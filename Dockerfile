FROM node:12.13.1

# install environment dependencies
RUN apt-get update && \
    apt-get -y install netcat && \
    apt-get clean

# set the working directory
RUN mkdir -p /usr/src

WORKDIR /usr/src

# add requirements
COPY package.json /usr/src

# install requirements
RUN yarn install

# add app
COPY . /usr/src/

# map app internal port
EXPOSE 4000

# run the server
CMD ["yarn", "dev"]
