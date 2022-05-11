#pull the image
FROM node:15.12.0-alpine

# set the working directory in the container
RUN mkdir /app

#change mode of the container directory
RUN chmod 777 /app

# set the working directory in the container
WORKDIR /app

#copy the files to the container directory
COPY package.json /app/package.json
COPY . /app

# install dependencies
RUN yarn install

# expose the port
EXPOSE 3000

# run the container
CMD ["yarn", "dev"]
