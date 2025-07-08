FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

ENV NODE_ENV=production
ENV CUSTOM_API_URL=""

CMD ["node", "dist/index.js"] 
