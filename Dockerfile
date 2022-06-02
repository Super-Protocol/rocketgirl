FROM node:16-buster AS builder

ARG ENV_FILE="must be base64 content of .env"
ARG NPM_TOKEN=""

RUN apt update

# Install Go
RUN apt install curl
RUN curl -O https://dl.google.com/go/go1.17.6.linux-amd64.tar.gz
RUN tar xvf go1.17.6.linux-amd64.tar.gz
RUN mv go /usr/local
ENV PATH=$PATH:/usr/local/go/bin:$GOPATH/bin

# Install python
ENV PYTHONUNBUFFERED=1
RUN apt install -y python3 python3-pip && ln -sf python3 /usr/bin/python
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /app
COPY package*.json /app/
RUN echo "$ENV_FILE" | base64 --decode > /app/.env
ADD .npmrc /app/.npmrc
RUN echo //npm.pkg.github.com/:_authToken=$NPM_TOKEN >> /app/.npmrc

RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
