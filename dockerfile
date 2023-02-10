FROM node
WORKDIR /app
COPY package.json .
RUN npm install -g pnpm
RUN pnpm i
COPY . .
EXPOSE 8031
CMD ["pnpm", "dev"]